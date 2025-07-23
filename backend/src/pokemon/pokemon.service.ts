import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { SearchPokemonDto } from './dto/search-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  /**
   * Import Pokemon from CSV file
   */
  async importFromCsv(filePath: string): Promise<{ imported: number; errors: any[] }> {
    const results: any[] = [];
    const errors: any[] = [];
    let imported = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          for (const row of results) {
            try {
              const pokemonData: CreatePokemonDto = {
                name: row.Name || row.name,
                type1: row.Type1 || row.type1 || row['Type 1'],
                type2: row.Type2 || row.type2 || row['Type 2'] || null,
                total: parseInt(row.Total || row.total) || 0,
                hp: parseInt(row.HP || row.hp) || 0,
                attack: parseInt(row.Attack || row.attack) || 0,
                defense: parseInt(row.Defense || row.defense) || 0,
                spAttack: parseInt(row['Special Attack'] || row['Sp. Atk'] || row.spAttack) || 0,
                spDefense: parseInt(row['Special Defense'] || row['Sp. Def'] || row.spDefense) || 0,
                speed: parseInt(row.Speed || row.speed) || 0,
                generation: parseInt(row.Generation || row.generation) || 1,
                legendary: (row.Legendary || row.legendary || '').toString().toLowerCase() === 'true',
                image: row.Image || row.image || null,
              };

              // Check if Pokemon already exists
              const existingPokemon = await this.pokemonRepository.findOne({
                where: { name: pokemonData.name }
              });

              if (!existingPokemon) {
                await this.pokemonRepository.save(pokemonData);
                imported++;
              }
            } catch (error) {
              errors.push({ row, error: error.message });
            }
          }

          // Clean up the uploaded file
          fs.unlinkSync(filePath);
          resolve({ imported, errors });
        })
        .on('error', (error) => {
          fs.unlinkSync(filePath);
          reject(error);
        });
    });
  }

  /**
   * Create a new Pokemon
   */
  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const pokemon = this.pokemonRepository.create(createPokemonDto);
    return this.pokemonRepository.save(pokemon);
  }

  /**
   * Get first 10 Pokemon for home page
   */
  async getFirstTen(): Promise<Pokemon[]> {
    return this.pokemonRepository.find({
      take: 10,
      order: { id: 'ASC' },
    });
  }

  /**
   * Search Pokemon with filters and pagination
   */
  async search(searchDto: SearchPokemonDto): Promise<{
    data: Pokemon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { name, type, legendary, minSpeed, maxSpeed, page = 1, limit = 20, sortBy = 'id', sortOrder = 'ASC' } = searchDto;

    const queryBuilder = this.pokemonRepository.createQueryBuilder('pokemon');

    // Apply filters
    if (name) {
      queryBuilder.andWhere('LOWER(pokemon.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (type) {
      queryBuilder.andWhere(
        '(LOWER(pokemon.type1) LIKE LOWER(:type) OR LOWER(pokemon.type2) LIKE LOWER(:type))',
        { type: `%${type}%` }
      );
    }

    if (legendary !== undefined) {
      queryBuilder.andWhere('pokemon.legendary = :legendary', { legendary });
    }

    if (minSpeed !== undefined && maxSpeed !== undefined) {
      queryBuilder.andWhere('pokemon.speed BETWEEN :minSpeed AND :maxSpeed', { minSpeed, maxSpeed });
    } else if (minSpeed !== undefined) {
      queryBuilder.andWhere('pokemon.speed >= :minSpeed', { minSpeed });
    } else if (maxSpeed !== undefined) {
      queryBuilder.andWhere('pokemon.speed <= :maxSpeed', { maxSpeed });
    }

    // Apply sorting
    queryBuilder.orderBy(`pokemon.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Get results and total count
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get Pokemon by ID
   */
  async findById(id: number): Promise<Pokemon | null> {
    return this.pokemonRepository.findOne({ where: { id } });
  }

  /**
   * Get all Pokemon types for filter options
   */
  async getTypes(): Promise<string[]> {
    const types = await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .select('DISTINCT pokemon.type1', 'type')
      .getRawMany();

    const types2 = await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .select('DISTINCT pokemon.type2', 'type')
      .where('pokemon.type2 IS NOT NULL')
      .getRawMany();

    const allTypes = [
      ...types.map(t => t.type),
      ...types2.map(t => t.type)
    ];

    return [...new Set(allTypes)].filter(Boolean).sort();
  }

  /**
   * Get Pokemon count
   */
  async getCount(): Promise<number> {
    return this.pokemonRepository.count();
  }

  /**
   * Delete all Pokemon (admin function)
   */
  async deleteAll(): Promise<void> {
    await this.pokemonRepository.clear();
  }
} 
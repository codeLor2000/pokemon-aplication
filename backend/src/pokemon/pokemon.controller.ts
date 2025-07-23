import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards,
  ParseIntPipe,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { SearchPokemonDto } from './dto/search-pokemon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * Import Pokemon from CSV file
   */
  @UseGuards(JwtAuthGuard)
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.match(/\.csv$/)) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    const result = await this.pokemonService.importFromCsv(file.path);
    return {
      message: `Successfully imported ${result.imported} Pokemon`,
      imported: result.imported,
      errors: result.errors,
    };
  }

  /**
   * Create a new Pokemon
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  /**
   * Get first 10 Pokemon for home page
   */
  @Get('first-ten')
  async getFirstTen() {
    return this.pokemonService.getFirstTen();
  }

  /**
   * Search Pokemon with filters and pagination
   */
  @Get('search')
  async search(@Query() searchDto: SearchPokemonDto) {
    return this.pokemonService.search(searchDto);
  }

  /**
   * Get all available Pokemon types
   */
  @Get('types')
  async getTypes() {
    return this.pokemonService.getTypes();
  }

  /**
   * Get Pokemon count
   */
  @Get('count')
  async getCount() {
    return { count: await this.pokemonService.getCount() };
  }

  /**
   * Get Pokemon by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const pokemon = await this.pokemonService.findById(id);
    if (!pokemon) {
      throw new BadRequestException('Pokemon not found');
    }
    return pokemon;
  }

  /**
   * Delete all Pokemon (admin function)
   */
  @UseGuards(JwtAuthGuard)
  @Post('clear-all')
  async deleteAll() {
    await this.pokemonService.deleteAll();
    return { message: 'All Pokemon deleted successfully' };
  }

  /**
   * Admin test endpoint for smoke testing
   */
  @Get('admin/test')
  getAdminTest(): { message: string; status: string } {
    return {
      message: 'Pokemon admin test endpoint working',
      status: 'OK',
    };
  }
} 
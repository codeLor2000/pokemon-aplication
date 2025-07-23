import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsString()
  type1: string;

  @IsOptional()
  @IsString()
  type2?: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsNumber()
  @Min(0)
  hp: number;

  @IsNumber()
  @Min(0)
  attack: number;

  @IsNumber()
  @Min(0)
  defense: number;

  @IsNumber()
  @Min(0)
  spAttack: number;

  @IsNumber()
  @Min(0)
  spDefense: number;

  @IsNumber()
  @Min(0)
  @Max(255)
  speed: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  generation: number;

  @IsBoolean()
  legendary: boolean;

  @IsOptional()
  @IsString()
  image?: string;
} 
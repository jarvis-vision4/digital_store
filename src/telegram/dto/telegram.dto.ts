import { IsString, IsOptional } from 'class-validator';

export class SimulateCommandDto {
  @IsString()
  command!: string;

  @IsString()
  @IsOptional()
  chatId?: string;

  @IsString()
  @IsOptional()
  username?: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @MinLength(8)
  @MaxLength(50)
  @Exclude()
  password: string;
}

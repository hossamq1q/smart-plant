import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Disease {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  englishName: string;

  @Column()
  arabicName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  causes: string;

  @Column({ type: 'text' })
  treatments: string;
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRoot('mongodb://mongo:27017', {dbName: 'Filmes'})],
})

export class DatabaseModule{}
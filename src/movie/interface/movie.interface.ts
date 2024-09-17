import { Document } from 'mongoose';

export interface Movie extends Document{
    readonly id: string
    readonly title: string;  
    readonly year: number; 
    readonly cast: string[];  
    readonly genres: string[];  
    readonly href: string;    
    readonly extract: string;    
    readonly thumbnail: string;    
    readonly thumbnail_width: number;  
    readonly thumbnail_height: number;
}
import { Photo } from './photo';

// create user interface based on user class in back-end
export interface User {
  id: number;
  name: string;
  knownAs: string;
  age: number;
  gender: string;
  created: Date;
  lastActive: Date;
  photoUrl: string;
  city: string;
  country: string;
  interest?: string; //  ? makes field optional, have to be added after required fields
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
}

import { Mongo } from 'meteor/mongo';

export const Convos = new Mongo.Collection('conversations', {idGeneration:"MONGO"});
import { Product } from "./Product";

export interface ILocalCartProduct extends Product {
    quantity: number;
}
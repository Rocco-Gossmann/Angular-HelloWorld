import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import Cryptography from '../../lib/cryptography'

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class KeyModule {
  private _ts!: string;
  private _key!: Promise<CryptoKey>;

  constructor() {
    console.log("key module constrct")
    const storageKey = "angular_todos_keybase";

    this._ts = localStorage.getItem(storageKey) || "";
    if(!this._ts) {
      this._ts = Cryptography.uuid();
      localStorage.setItem(storageKey, this._ts);
    }
  }

  get cryptoKey(): Promise<CryptoKey> {
    return this._key;
  }

}

export const key = new KeyModule();
export default key;

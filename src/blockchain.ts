import { hash, validateHash } from "./helpers";

export interface Block {
  header: {
    nonce: number,
    hash: string
  }
  payload: {
    sequency: number,
    timestamp: number,
    data: any,
    prevHash: string
  }
}

export class Blockchain {
  #chain: Block[] = [];
  private prefix = '0';

  constructor(private readonly dificulty: number = 4) {
    this.#chain.push(this.createGenesisBlock());
  }

  private createGenesisBlock(): Block {
    const payload: Block['payload'] = {
      sequency: 0,
      timestamp: +new Date(),
      data: 'Genesis Block',
      prevHash: ''
    }

    const payloadHash = hash(JSON.stringify(payload));
    const header = validateHash(payloadHash, this.prefix, this.dificulty);

    const genesisBlock = {
      header,
      payload
    }

    console.log(`GENESIS BLOCK: ${JSON.stringify(genesisBlock)}`);

    return genesisBlock;
  }

  get chain(): Block[] {
    return this.#chain;
  }

  private get lastBlock(): Block {
    return this.#chain.at(-1) as Block;
  }

  newBlock(data: any): Block['payload'] {
    const payload = {
      sequency: this.lastBlock.payload.sequency + 1,
      timestamp: +new Date(),
      data,
      prevHash: this.lastBlock.header.hash
    }

    return payload;
  }

  mineBlock(payload: Block['payload']): Block {
    const start = +new Date();
    const payloadHash = hash(JSON.stringify(payload));
    const header = validateHash(payloadHash, this.prefix, this.dificulty);
    const end = +new Date();

    console.log(`Block mined in ${(end - start) / 1000} seconds.`);

    const newBlock = {
      header,
      payload
    }

    console.log(
      `Block candidate for sequency ${payload.sequency} created. 
      Pending validation. 
      ${JSON.stringify(newBlock)}`
    );

    return newBlock;
  }

  private verifyBlock(block: Block): boolean {
    if(block.payload.prevHash === this.lastBlock.header.hash) {
      console.log(
        `Block validation successful. 
        Block added to the chain at sequency ${block.payload.sequency}.`
      );
      return true;
    }
    console.error(
      `Block validation failed: Invalid hash detected for block at sequency ${block.payload.sequency}.
      Expected hash: ${block.payload.prevHash}, but got: ${block.header.hash}. 
      Block not added to the chain. 
      Possible causes: data corruption, tampering, or incorrect hash function.`
    );
    return false;
  }

  addBlock(block: Block): void {
    if(this.verifyBlock(block)) this.#chain.push(block);
  }
}

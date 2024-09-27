import { Blockchain } from './blockchain';

const dificulty = Number(process.argv[2]) || 4;
const blockchain = new Blockchain(dificulty);

const blocks = Number(process.argv[3]) || 10;
let { chain } = blockchain;

for(let i = 1; i <= blocks; i++) {
  const blockPayload = blockchain.newBlock(`Block ${i}`);
  const block = blockchain.mineBlock(blockPayload);
  blockchain.addBlock(block);
  chain = blockchain.chain;
}

console.log('---- BLOCKCHAIN ----');
console.log(chain);

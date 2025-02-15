# 🚀 opti Backend

A simple Node.js API using Express, Prisma, and Ethers.js to fetch and update staking data on the Base Sepolia network.

## 📌 Features
- Fetch staking data for multiple tokens
- Retrieve staking data by protocol ID or token address
- Update staking data from the blockchain

## 🛠️ Technologies Used
- **Node.js** (Express.js for backend framework)
- **Ethers.js** (for blockchain interaction)
- **Prisma** (for database management)
- **dotenv** (for environment variables)
- **CORS** (for cross-origin requests support)

## 🔧 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your `.env` file:
   ```env
   PORT=3000
   DATABASE_URL=your_database_url_here
   RPC_URL=your_rpc_url_here
   ```
4. Run the server:
   ```sh
   npm start
   ```

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/staking` | Get all staking data |
| `GET` | `/staking/:idProtocol` | Get staking data by protocol ID |
| `GET` | `/staking/:address` | Get staking data by token address |
| `POST` | `/staking/update` | Update staking data from blockchain |

## 🔗 Token Contracts
| Token | Address | Staking Contract |
|--------|----------------------------------|----------------------------------|
| **UNI** | `0x1eaC9BB63f8673906dBb75874356E33Ab7d5D780` | `0xa42A86906D3FDfFE7ccc1a4E143e5Ddd8dF0Cf83` |
| **USDC** | `0x0E8Ac3cc5183A243FcbA007136135A14831fDA99` | `0x5dC10711C60dd5174306aEC6Fb1c78b895C9fA5A` |
| **USDT** | `0xbF1876d7643a1d7DA52C7B8a67e7D86aeeAA12A6` | `0xD1b1954896009800dF01b197A6E8E1d98FF44ae8` |
| **DAI** | `0xD1d25fc5faC3cd5EE2daFE6292C5DFC16057D4d1` | `0x0CAf83Ef2BA9242F174FCE98E30B9ceba299aaa3` |
| **WETH** | `0x134C06B12eA6b1c7419a08085E0de6bDA9A16dA2` | `0x6c36eD76d3FF0A7C0309aef473052b487895Fadf` |

## ⚡ Quick Test with cURL
Get all staking data:
```sh
curl -X GET http://localhost:3000/staking
```

Update staking data:
```sh
curl -X POST http://localhost:3000/staking/update
```

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
👨‍💻 Built with ❤️ by [Your Name](https://github.com/your-username/)


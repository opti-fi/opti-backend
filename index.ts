import express from "express";
import type { Request, Response } from "express";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

app.use(cors());
app.use(express.json());

const MOCK_TOKENS = {
  UNI: {
    token: "0x1eaC9BB63f8673906dBb75874356E33Ab7d5D780",
    staking: "0xa42A86906D3FDfFE7ccc1a4E143e5Ddd8dF0Cf83",
    nameProject: "Uniswap"
  },
  USDC: {
    token: "0x0E8Ac3cc5183A243FcbA007136135A14831fDA99",
    staking: "0x5dC10711C60dd5174306aEC6Fb1c78b895C9fA5A",
    nameProject: "AaveV3"
  },
  USDT: {
    token: "0xbF1876d7643a1d7DA52C7B8a67e7D86aeeAA12A6",
    staking: "0xD1b1954896009800dF01b197A6E8E1d98FF44ae8",
    nameProject: "CompoundV3"
  },
  DAI: {
    token: "0xD1d25fc5faC3cd5EE2daFE6292C5DFC16057D4d1",
    staking: "0x0CAf83Ef2BA9242F174FCE98E30B9ceba299aaa3",
    nameProject: "StargateV3"
  },
  WETH: {
    token: "0x134C06B12eA6b1c7419a08085E0de6bDA9A16dA2",
    staking: "0x6c36eD76d3FF0A7C0309aef473052b487895Fadf",
    nameProject: "UsdxMoney"
  }
};

const LOGOS = {
  [MOCK_TOKENS.UNI.token]: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  [MOCK_TOKENS.USDC.token]: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  [MOCK_TOKENS.USDT.token]: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  [MOCK_TOKENS.DAI.token]: "https://cryptologos.cc/logos/dai-dai-logo.png",
  [MOCK_TOKENS.WETH.token]: "https://img.cryptorank.io/coins/weth1701090834118.png",
};

const stakingABI = [
  "function fixedAPY() public view returns (uint8)",
  "function totalAmountStaked() public view returns (uint256)",
];

async function updateStakingData(tokenKey: keyof typeof MOCK_TOKENS) {
  try {
    const { token, staking } = MOCK_TOKENS[tokenKey];
    const contract = new ethers.Contract(staking, stakingABI, provider);

    const apy = await contract.fixedAPY();
    const totalStaked = await contract.totalAmountStaked();

    const formattedTVL = Number(ethers.formatUnits(totalStaked, 6));
    const formattedAPY = Number(apy);

    await prisma.staking.upsert({
      where: { addressToken: token },
      update: {
        tvl: formattedTVL,
        apy: formattedAPY,
        updatedAt: new Date()
      },
      create: {
        idProtocol: MOCK_TOKENS[tokenKey].nameProject + "_" + tokenKey,
        addressToken: token,
        addressStaking: staking,
        nameToken: tokenKey,
        nameProject: MOCK_TOKENS[tokenKey].nameProject,
        chain: "Base Sepolia",
        apy: formattedAPY,
        stablecoin: tokenKey === "USDC" || tokenKey === "USDT" ? true : false,
        categories: ["Staking", tokenKey === "USDC" || tokenKey === "USDT" ? "Stablecoin" : ""].filter(Boolean),
        logo: LOGOS[token] || "",
        tvl: formattedTVL,
      },
    });

    console.log(`Updated staking data for ${tokenKey}`);
  } catch (error) {
    console.error(`Error updating staking data for ${tokenKey}:`, error);
  }
}

const getStakingData = async (req: Request, res: Response) => {
  try {
    const data = await prisma.staking.findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staking data" });
  }
};

const getStakingByIdProtocol = async (req: any, res: any) => {
  try {
    const data = await prisma.staking.findMany({
      where: { idProtocol: req.params.idProtocol },
    });

    if (!data) {
      return res.status(404).json({ error: "Staking data not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staking data" });
  }
};

const getStakingByAddress = async (req: any, res: any) => {
  try {
    const data = await prisma.staking.findUnique({
      where: { addressToken: req.params.address },
    });

    if (!data) {
      return res.status(404).json({ error: "Staking data not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staking data" });
  }
};

const updateStaking = async (req: Request, res: Response) => {
  try {
    const updatePromises = Object.keys(MOCK_TOKENS).map((tokenKey) =>
      updateStakingData(tokenKey as keyof typeof MOCK_TOKENS)
    );

    await Promise.all(updatePromises);

    res.json({ message: "All staking data updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update staking data" });
  }
};

app.get("/staking", getStakingData);
app.get("/staking/:idProtocol", getStakingByIdProtocol);
app.get("/staking/:address", getStakingByAddress);
app.post("/staking/update", updateStaking);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;

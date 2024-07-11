import { useAccount, useWriteContract } from "wagmi";
import { nftContractConfig } from "@/config/nftContractConfig";
import { FormEvent } from "react";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {nftMarketContractConfig} from "@/config/nftMarketContractConfig";

export default function NftContract() {
  return (
    <div>
      <Mint />
      <Approve />
    </div>
  );
}

function Mint() {
  const { data: hash, writeContract } = useWriteContract();
  const { address } = useAccount();

  async function mintClick() {
    if (address) {
      writeContract({
        ...nftContractConfig,
        functionName: "mint",
        args: [address],
      });
    }
  }

  return (
    <div>
      <Button className="border-2 border-gray-200" onClick={mintClick}>mint</Button>
      {hash && <div>transaction hash: {hash}</div>}
    </div>
  );
}

function Approve() {
  const { data: hash, error, writeContract } = useWriteContract();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formDate = new FormData(e.target as HTMLFormElement);
    const tokenId = formDate.get("tokenId") as string;
    writeContract({
      ...nftContractConfig,
      functionName: "approve",
      args: [nftMarketContractConfig.address, BigInt(tokenId)],
    });
  }

  if (error) {
    return <div>something is wrong: {error.message}</div>
  }

  return (
    <div className="w-1/3 m-4">
      <form onSubmit={submit}>
        <Input label="tokenId" name="tokenId" isRequired placeholder="1234" />
        <Button type="submit">Approve</Button>
        {hash && <div>transaction hash: {hash}</div>}
      </form>
    </div>
  );
}

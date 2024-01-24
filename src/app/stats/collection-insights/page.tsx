"use client";

import { Histogram } from "@/components/stats/collection-insights/Histogram";
import { PieChart } from "@/components/stats/collection-insights/PieChart";
import { TableData } from "@/components/stats/collection-insights/TableData";
import {
  HolderDistributions,
  TopHolderWithRank,
  VolumeTransformedData,
} from "@/lib/constants";
import { useEffect, useState } from "react";

export default function Page() {
  const [apeDistributions, setApeDistributions] =
    useState<HolderDistributions>();
  const [cabinDistributions, setCabinDistributions] =
    useState<HolderDistributions>();
  const [cotasDistributions, setCotasDistributions] =
    useState<HolderDistributions>();
  const [apeTopHolders, setApeTopHolders] = useState<TopHolderWithRank[]>();
  const [cabinTopHolders, setCabinTopHolders] = useState<TopHolderWithRank[]>();
  const [cotasTopHolders, setCotasTopHolders] = useState<TopHolderWithRank[]>();
  const [volumeData, setVolumeData] = useState<VolumeTransformedData[]>();

  async function getHolderDistributionsData() {
    const response = await fetch("/api/taptools/holder-distributions", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { apes, cabins, cotas } = await response.json();
    setApeDistributions(apes);
    setCabinDistributions(cabins);
    setCotasDistributions(cotas);
  }

  async function getTopHoldersData() {
    const response = await fetch("/api/taptools/top-holders", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { apes, cabins, cotas } = await response.json();
    setApeTopHolders(apes);
    setCabinTopHolders(cabins);
    setCotasTopHolders(cotas);
  }

  async function getVolumeData() {
    const response = await fetch("/api/taptools/volume", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { volumeData } = await response.json();
    setVolumeData(volumeData);
  }

  useEffect(() => {
    getHolderDistributionsData();
    getTopHoldersData();
    getVolumeData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full md:p-2">
        <div className="md:grid md:mb-4 text-center">
          {volumeData && <Histogram data={volumeData} />}
        </div>
        <div className="md:grid md:grid-cols-3 gap-4 md:mb-4">
          {apeDistributions && (
            <PieChart data={apeDistributions} title="Ape distribution" />
          )}
          {cabinDistributions && (
            <PieChart data={cabinDistributions} title="Cabin distribution" />
          )}
          {cotasDistributions && (
            <PieChart data={cotasDistributions} title="COTAS distribution" />
          )}
        </div>
        <div className="md:grid md:grid-cols-3 gap-4 md:mb-4">
          {apeTopHolders && (
            <TableData data={apeTopHolders} title="The Infamous TAS60" />
          )}
          {cabinTopHolders && (
            <TableData data={cabinTopHolders} title="Cabin top holders" />
          )}
          {cotasTopHolders && (
            <TableData data={cotasTopHolders} title="COTAS top holders" />
          )}
        </div>
      </div>
    </div>
  );
}

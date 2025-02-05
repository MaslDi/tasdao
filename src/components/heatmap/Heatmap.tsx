"use client";

import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CabinInfobar from "@/components/heatmap/CabinInfobar";
import HeatmapCell from "@/components/heatmap/HeatmapCell";
import {
  CabinDetails,
  defaultCabin,
  sizeOptions,
  ratingOptions,
} from "@/lib/constants";
import HeatmapControls from "@/components/heatmap/HeatmapControls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Heatmap: React.FC = () => {
  const [cabins, setCabins] = useState<CabinDetails[]>([]);
  const [hoveredCabin, setHoveredCabin] = useState<CabinDetails>(defaultCabin);
  const [selectedCabin, setSelectedCabin] = useState<CabinDetails | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(
    new Set(sizeOptions),
  );
  const [showLandmark, setShowLandmark] = useState<boolean>(false);
  const [selectedRatings, setSelectedRatings] = useState<Set<string>>(
    new Set(ratingOptions),
  );
  const [showForSale, setForSale] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getCabins", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const { cabins } = await response.json();
      setCabins(cabins);
    };
    fetchData();
  }, []);

  const handleMouseEnter = (cell: CabinDetails) => {
    if (!selectedCabin) {
      setHoveredCabin(cell);
    }
  };

  const handleCellClick = (cell: CabinDetails) => {
    if (selectedCabin === null) {
      setSelectedCabin(cell);
    } else {
      setSelectedCabin(null);
    }
  };

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes((prevSelectedSizes) => {
      const newSelectedSizes = new Set(prevSelectedSizes);
      if (newSelectedSizes.has(size)) {
        newSelectedSizes.delete(size);
      } else {
        newSelectedSizes.add(size);
      }
      return newSelectedSizes;
    });
  };

  const toggleRating = (rating: string) => {
    setSelectedRatings((prevRatings) => {
      const newRatings = new Set(prevRatings);
      if (newRatings.has(rating)) {
        newRatings.delete(rating);
      } else {
        newRatings.add(rating);
      }
      return newRatings;
    });
  };

  const selectAllRatings = () => {
    setSelectedRatings(new Set(ratingOptions));
  };

  const deselectAllRatings = () => {
    setSelectedRatings(new Set());
  };

  const isCabinSelected = selectedCabin !== null;

  return (
    <div className="flex">
      <div className="w-64">
        <CabinInfobar
          cell={selectedCabin || hoveredCabin}
          sizes={selectedSizes}
          ratings={selectedRatings}
          showForSale={showForSale}
          showLandmark={showLandmark}
          isCabinSelected={isCabinSelected}
          minPrice={minPrice}
          maxPrice={maxPrice}
          toggleSizeFilter={toggleSizeFilter}
          toggleRating={toggleRating}
          selectAllRatings={selectAllRatings}
          deselectAllRatings={deselectAllRatings}
          toggleForSale={() => setForSale(!showForSale)}
          toggleLandmarkFilter={() => setShowLandmark(!showLandmark)}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <TransformWrapper
          limitToBounds={false}
          panning={{
            velocityDisabled: false,
          }}
        >
          <HeatmapControls />
          <Card className="w-full flex-grow flex justify-center items-center">
            <CardContent className="pt-2 min-w-[1200px] min-h-screen">
              <TransformComponent>
                <div className="hidden md:grid md:grid-cols-101 md:grid-rows-101 md:border-2 md:border-ring">
                  {cabins.map((cell) => (
                    <HeatmapCell
                      key={cell.id}
                      cell={cell}
                      showForSale={showForSale}
                      showLandmark={showLandmark}
                      isSelected={selectedCabin?.id === cell.id}
                      selectedSizes={selectedSizes}
                      selectedRatings={selectedRatings}
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      onMouseEnter={handleMouseEnter}
                      onClick={handleCellClick}
                    />
                  ))}
                </div>
              </TransformComponent>
            </CardContent>
          </Card>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default Heatmap;

export type DroneCategory = "Filming" | "Cargo";

export type Drone = {
  id: string;
  name: string;
  description: string;
  category: DroneCategory;
  dailyRate: number;
  loadCapacityKg?: number;
};

export const INVENTORY: Drone[] = [
  {
    id: "cinema-pro-x8",
    name: "Cinema Pro X8",
    description: "8K stabilized camera drone for production shoots.",
    category: "Filming",
    dailyRate: 220,
  },
  {
    id: "followshot-air",
    name: "FollowShot Air",
    description: "Compact tracking drone for outdoor content teams.",
    category: "Filming",
    dailyRate: 140,
  },
  {
    id: "cargo-lift-20",
    name: "CargoLift 20",
    description: "Heavy-lift drone for high-volume transport tasks.",
    category: "Cargo",
    dailyRate: 260,
    loadCapacityKg: 20,
  },
  {
    id: "swift-hauler",
    name: "Swift Hauler",
    description: "Fast mid-range logistics drone for urban deliveries.",
    category: "Cargo",
    dailyRate: 180,
    loadCapacityKg: 12,
  },
];

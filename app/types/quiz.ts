export interface Categories {
    cpu_general_performance: number;
    cpu_gaming_performance: number;
    upgradable: number;
    gpu_gaming_performance: number;
    gpu_productivity_performance: number;
    vram: number;
    rgb: number;
    noise: number;
    ports: number;
    wifi: number;
    ethernet: number;
    nvme: number;
    rating: number;
    ram_capacity: number;
    ram_speed: number;
    storage_capacity: number;
    storage_speed: number;
    price: number;
    budget: number;
    dgpu: boolean;
}

export interface PcBuild {
    cpu_model: string;
    cpu_link: string;
    motherboard_model: string;
    motherboard_link: string;
    cooler_model: string;
    cooler_link: string;
    ram_model: string;
    ram_link: string;
    ram_sticks: number;
    gpu_model: string;
    gpu_link: string;
    storage_model: string;
    storage_link: string;
    psu_model: string;
    psu_link: string;
    case_model: string;
    case_link: string;
    price: number;
    score: number;
}
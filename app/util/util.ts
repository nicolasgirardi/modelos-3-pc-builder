import {Categories} from "@/app/types/quiz";

export function answersToWeights(data: URLSearchParams): Categories {
    const answers = {
        q1: data.get("q1")?.split(",") ?? [], // ["B", "A"]
        q2: data.get("q2"),                   // "B" | null
        q3: data.get("q3")?.split(",") ?? [], // ["A", "B"]
        q4: data.get("q4"),                   // "B" | null
        q5: data.get("q5"),
        q6: data.get("q6"),
        q7: data.get("q7"),
        q8: data.get("q8"),
        q9: data.get("q9"),
        q10: data.get("q10"),
        q11: Number(data.get("q11") ?? 30000000),    // 3000000
        q12: data.get("q12"),
        qgpu: data.get("qgpu"),
    };
    return {
        cpu_general_performance: cpu_general_performance(answers.q1, answers.q2),
        cpu_gaming_performance: cpu_gaming_performance(answers.q1, answers.q3),
        upgradable: upgradable(answers.q10),
        gpu_gaming_performance: gpu_gaming_performance(answers.q1, answers.q3, answers.q4),
        gpu_productivity_performance: gpu_productivity_performance(answers.q1, answers.q2, answers.qgpu),
        vram: vram(answers.q1, answers.q2, answers.q3, answers.q4),
        rgb: rgb(answers.q9),
        noise: noise(answers.q8),
        ports: ports(answers.q5, answers.q1),
        wifi: wifi(answers.q7),
        ethernet: ethernet(answers.q7),
        nvme: nvme(answers.q6),
        rating: upgradable(answers.q10),
        ram_capacity: ram_capacity(answers.q1, answers.q2, answers.q3, answers.q4),
        ram_speed: Math.floor((cpu_general_performance(answers.q1, answers.q2) + cpu_gaming_performance(answers.q1, answers.q3))/2),
        storage_capacity: storage_capacity(answers.q5, answers.q3),
        storage_speed: Math.floor((cpu_general_performance(answers.q1, answers.q2) + cpu_gaming_performance(answers.q1, answers.q3))/2),
        price: price(answers.q12),
        budget: answers.q11,
        dgpu: dgpu(answers.q1, answers.qgpu)
    }
}

function cpu_general_performance(q1: string[], qa1: string | null): number {
    let weight = 1
    if  (qa1 !== null) {
        if (qa1 === "B") {
            weight = 3;
        }
        if (qa1 === "C") {
            weight = 8;
        }
        if (qa1 === "D") {
            weight = 14;
        }

    }
    for (const answer of q1) {
        if (answer === "C") {
            weight = Math.max(weight, 20);
        }
        if (answer === "D") {
            weight = Math.max(weight, 10);
        }
        if (answer === "E") {
            weight = Math.max(weight, 14);
        }
    }
    return weight
}

function cpu_gaming_performance(q1: string[], qb1: string[]): number {
    let weight = 1
    for (const answer of qb1) {
        if (answer === "A") {
            weight = Math.max(weight, 12);
        }
        if (answer === "B") {
            weight = Math.max(weight, 15);
        }
        if (answer === "C") {
            weight = Math.max(weight, 6);
        }
        if (answer === "D") {
            weight = Math.max(weight, 4);
        }
    }
    for (const answer of q1) {
        if (answer === "C") {
            weight = Math.max(weight, 20);
        }
    }
    return weight
}

function upgradable(q8: string | null): number {
    if  (q8 !== null) {
        if (q8 === "B") {
            return 3
        }
        if (q8 === "C") {
            return 8
        }
    }
    return 1
}

function gpu_gaming_performance(q1: string[], qb1: string[], qb2: string | null) : number {
    let weight = 1
    for (const answer of qb1) {
        if (answer === "A") {
            weight = Math.max(weight, 16);
        }
        if (answer === "B") {
            weight = Math.max(weight, 12);
        }
        if (answer === "C") {
            weight = Math.max(weight, 6);
        }
    }
    for (const answer of q1) {
        if (answer === "C") {
            weight = Math.max(weight, 20);
        }
    }
    if  (qb2 !== null) {
        if (qb2 === "B") {
            weight = weight + 2;
        }
        if (qb2 === "C") {
            weight = weight + 6;
        }
    }
    return weight
}

function gpu_productivity_performance(q1: string[], qa1: string | null, qgpu: string | null): number {
    let weight = 1
    if  (qa1 !== null) {
        if (qa1 === "B") {
            weight = 6;
        }
        if (qa1 === "C") {
            weight = 8;
        }
        if (qa1 === "D") {
            weight = 16;
        }
    }
    for (const answer of q1) {
        if (answer === "C" || answer === "E") {
            weight = Math.max(weight, 16);
        }
        if (answer === "F") {
            weight = Math.max(weight, 20);
        }
    }
    if (qgpu !== null) {
        if (qgpu === "A") {
            weight = Math.max(weight, 6);
        }
    }
    return weight
}

function vram(q1: string[], qa1: string | null, qb1: string[], qb2: string | null): number {
    let weight = 1
    if  (qa1 !== null) {
        if (qa1 === "B") {
            weight = 2;
        }
        if (qa1 === "C") {
            weight = 4;
        }
        if (qa1 === "D") {
            weight = 8;
        }
    }
    for (const answer of qb1) {
        if (answer === "A") {
            weight = Math.max(weight, 12);
        }
        if (answer === "B") {
            weight = Math.max(weight, 6);
        }
        if (answer === "C") {
            weight = Math.max(weight, 3);
        }
        if (answer === "D") {
            weight = Math.max(weight, 1);
        }
    }
    if  (qb2 !== null) {
        if (qb2 === "A") {
            weight = weight + 1;
        }
        if (qb2 === "B") {
            weight = weight + 2;
        }
        if (qb2 === "C") {
            weight = weight + 4;
        }
    }
    for (const answer of q1) {
        if (answer === "C") {
            weight = Math.max(weight, 10);
        }
        if (answer === "E") {
            weight = Math.max(weight, 20);
        }
    }
    return weight
}

function rgb(q9: string | null): number {
    if  (q9 !== null) {
        if (q9 === "B") {
            return 3
        }
        if (q9 === "C") {
            return 5
        }
    }
    return 1
}

function noise(q8: string | null): number {
    if  (q8 !== null) {
        if (q8 === "B") {
            return 3
        }
        if (q8 === "C") {
            return 5
        }
        if (q8 === "D") {
            return 10
        }
    }
    return 1
}

function wifi(q7: string | null): number {
    if  (q7 !== null) {
        if (q7 === "B" || q7 === "C") {
            return 8
        }
        if (q7 === "D") {
            return 4
        }
    }
    return 1
}

function ethernet(q7: string | null): number {
    if  (q7 !== null) {
        if (q7 === "A" || q7 === "C") {
            return 8
        }
        if (q7 === "D") {
            return 4
        }
    }
    return 1
}

function ports(q5: string | null, q1: string[]): number {
    for (const answer of q1) {
        if (answer !== "D") {
            return 10
        }
    }
    if (q5 !== null) {
        if (q5 === "C") {
            return 5
        }
    }
    return 1
}

function nvme(q6: string | null): number {
    if  (q6 !== null) {
        if (q6 === "A") {
            return 8
        }
        if (q6 === "B") {
            return 4
        }
    }
    return 1
}

function ram_capacity(q1: string[], qa1: string | null, qb1: string[], qb2: string | null): number {
    let weight = 2
    if  (qa1 !== null) {
        if (qa1 === "B") {
            weight = 4;
        }
        if (qa1 === "C") {
            weight = 6;
        }
        if (qa1 === "D") {
            weight = 8;
        }
    }
    for (const answer of qb1) {
        if (answer === "A") {
            weight = Math.max(weight, 14);
        }
        if (answer === "B") {
            weight = Math.max(weight, 12);
        }
        if (answer === "C") {
            weight = Math.max(weight, 3);
        }
        if (answer === "D") {
            weight = Math.max(weight, 1);
        }
    }
    if  (qb2 !== null) {
        if (qb2 === "B") {
            weight = weight + 1;
        }
        if (qb2 === "C") {
            weight = weight + 2;
        }
    }
    for (const answer of q1) {
        if (answer === "C" || answer === "E") {
            weight = Math.max(weight, 14);
        }
        if (answer === "D") {
            weight = Math.max(weight, 6);
        }
        if (answer === "E") {
            weight = Math.max(weight, 10);
        }
    }
    return weight
}

function storage_capacity(q5: string | null, qb1: string[]): number {
    let weight = 1
    for (const answer of qb1) {
        if (answer === "A" || answer === "B") {
            weight = Math.max(weight, 14);
        }
        if (answer === "C") {
            weight = Math.max(weight, 5);
        }
        if (answer === "D") {
            weight = Math.max(weight, 2);
        }
    }
    if (q5 !== null) {
        if (q5 === "B") {
            return Math.max(weight, 4);
        }
        if (q5 === "C") {
            return Math.max(weight, 6);
        }
        if (q5 === "D") {
            return Math.max(weight, 10);
        }
    }
    return 1
}

function price(q12: string | null) {
    if  (q12 !== null) {
        if (q12 === "B") {
            return 8
        }
        if (q12 === "C") {
            return 20
        }
        if (q12 === "D") {
            return 40
        }
    }
    return 1
}

export function categoriesToQueryString(categories: Categories): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(categories)) {
        params.append(key, value.toString());
    }

    return params.toString();
}

function dgpu(q1: string[], qgpu: string | null): boolean {
    if (qgpu !== null) {
        if (qgpu === "A") {
            return true
        }
    }
    for (const answer of q1) {
        if (answer !== "D" && answer !== "F") {
            return true
        }
    }
    return false;
}
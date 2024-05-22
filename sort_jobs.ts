import { JOBS_LIST } from "./constants";
import * as readline from "readline";

const START_POINT: IAddress = {
    street: "6050 JFK Blvd E",
    city: "Springfield",
    state: "IL",
    country: "USA",
    zip: "62701"
};

export interface IAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export interface IJob {
    address: IAddress;
    name: string;
    duration: number;
}

// Function to get a random integer between min and max (inclusive)
function randomNumber(address_one: IAddress, address_two: IAddress): number {
    return getRandomInt(1, 50);
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function scheduleJobs(jobs_list: IJob[], start_point: IAddress, jobs_per_day: number, days: string[]) {
    let current_job: IJob = jobs_list[0];
    let nearest_jobs: IJob[] = jobs_list.slice(1);
    const completed_jobs: IJob[] = [current_job];
    const schedule: { week: number, day: string, jobs: IJob[] }[] = [];
    let week_count = 1;
    let day_index = 0;

    while (nearest_jobs.length > 0) {
        let nearest_job_index = -1;
        let shortest_distance = Number.MAX_SAFE_INTEGER;

        nearest_jobs.forEach((job, index) => {
            const distance = randomNumber(current_job.address, job.address);
            if (distance < shortest_distance) {
                shortest_distance = distance;
                nearest_job_index = index;
            }
        });

        if (nearest_job_index !== -1 && nearest_jobs[nearest_job_index]) {
            const nearest_job = nearest_jobs[nearest_job_index];
            current_job = nearest_job;
            nearest_jobs.splice(nearest_job_index, 1);
            completed_jobs.push(nearest_job);
        }
    }

    for (let i = 0; i < completed_jobs.length; i += jobs_per_day) {
        const day_jobs = completed_jobs.slice(i, i + jobs_per_day);
        const day_name = days[day_index % days.length];
        schedule.push({ week: Math.floor(day_index / days.length) + 1, day: day_name, jobs: day_jobs });
        day_index++;
    }

    schedule.forEach(entry => {
        console.log(`Week ${entry.week}`);
        console.log(`${entry.day}  | Total Jobs ${entry.jobs.length}`);
        console.log("The jobs scheduled for today are:", entry.jobs.map(job => job.name).join(", ") + ".");
        console.log(`The first job in route is ${entry.jobs[0].name}, the next job in route is ${entry.jobs.slice(1).map(job => job.name).join(", ")}`);
        
        // Calculate total miles
        let total_miles = 0;
        if (entry.jobs.length > 1) {
            for (let i = 0; i < entry.jobs.length - 1; i++) {
                total_miles += randomNumber(entry.jobs[i].address, entry.jobs[i + 1].address);
            }
        } else {
            // If there's only one job, calculate the distance from the start point to the job
            total_miles = randomNumber(START_POINT, entry.jobs[0].address);
        }
        console.log(`The total miles is ${total_miles}`);
        console.log("________________________________________________________________");
    });
}

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("How many jobs can you schedule in a day? ", (jobsAnswer) => {
        const jobs_per_day = parseInt(jobsAnswer);
        if (isNaN(jobs_per_day) || jobs_per_day <= 0) {
            console.log("Please enter a valid number.");
            rl.close();
        } else {
            rl.question("What days of the week can you schedule for? (e.g., Monday, Wednesday, Friday) ", (daysAnswer) => {
                const days = daysAnswer.split(',').map(day => day.trim()).filter(day => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day));
                if (days.length === 0) {
                    console.log("Please enter valid days of the week.");
                    rl.close();
                } else {
                    scheduleJobs(JOBS_LIST, START_POINT, jobs_per_day, days);
                    rl.close();
                }
            });
        }
    });
}

main();


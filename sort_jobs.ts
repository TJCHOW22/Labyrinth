import { JOBS_LIST } from "./constants";
import * as readline from "readline";
import axios from "axios";

const START_POINT: IAddress = {
    street: "19 Baltimore St",
    city: "Staten Island",
    state: "NY",
    country: "USA",
    zip: "10308"
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

// Function to get the distance between two addresses using Google Maps Distance Matrix API
async function getDistance(address_one: IAddress, address_two: IAddress): Promise<number> {
    const apiKey = 'AIzaSyBk3lI51HqGuR7R1bCEmN982qVM8tcfDwk'; // Replace with your actual Google Maps API key
    const origins = `${address_one.street}, ${address_one.city}, ${address_one.state}, ${address_one.zip}`;
    const destinations = `${address_two.street}, ${address_two.city}, ${address_two.state}, ${address_two.zip}`;

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: origins,
                destinations: destinations,
                key: apiKey
            }
        });

        const distance = response.data.rows[0].elements[0].distance.value; // distance in meters
        return distance / 1609.34; // convert meters to miles
    } catch (error) {
        console.error('Error fetching distance from Google Maps API', error);
        return Number.MAX_SAFE_INTEGER; // Return a large number to indicate failure
    }
}

async function scheduleJobs(jobs_list: IJob[], start_point: IAddress, jobs_per_day: number, days: string[]) {
    let current_job: IJob = { address: start_point, name: "Start Point", duration: 0 };
    let nearest_jobs: IJob[] = jobs_list;
    const completed_jobs: IJob[] = [];
    const schedule: { week: number, day: string, jobs: IJob[] }[] = [];
    let week_count = 1;
    let day_index = 0;

    while (nearest_jobs.length > 0) {
        let nearest_job_index = -1;
        let shortest_distance = Number.MAX_SAFE_INTEGER;

        for (let index = 0; index < nearest_jobs.length; index++) {
            const job = nearest_jobs[index];
            const distance = await getDistance(current_job.address, job.address);
            if (distance < shortest_distance) {
                shortest_distance = distance;
                nearest_job_index = index;
            }
        }

        if (nearest_job_index !== -1 && nearest_jobs[nearest_job_index]) {
            const nearest_job = nearest_jobs[nearest_job_index];
            console.log(`The job "${nearest_job.name}" is ${shortest_distance.toFixed(2)} miles from "${current_job.name}".`);
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

    for (const entry of schedule) {
        console.log(`Week ${entry.week}`);
        console.log(`${entry.day}  | Total Jobs ${entry.jobs.length}`);
        console.log("The jobs scheduled for today are:", entry.jobs.map(job => job.name).join(", ") + ".");
        
        // Calculate total miles and print distances between jobs
        let total_miles = 0;
        if (entry.jobs.length > 0) {
            // Distance from START_POINT to the first job
            let distance = await getDistance(START_POINT, entry.jobs[0].address);
            console.log(`The first job "${entry.jobs[0].name}" is ${distance.toFixed(2)} miles from the headquarters.`);
            total_miles += distance;

            // Distances between jobs
            for (let i = 0; i < entry.jobs.length - 1; i++) {
                distance = await getDistance(entry.jobs[i].address, entry.jobs[i + 1].address);
                console.log(`The job "${entry.jobs[i + 1].name}" is ${distance.toFixed(2)} miles from "${entry.jobs[i].name}".`);
                total_miles += distance;
            }

            // Distance from the last job back to START_POINT
            distance = await getDistance(entry.jobs[entry.jobs.length - 1].address, START_POINT);
            console.log(`The last job "${entry.jobs[entry.jobs.length - 1].name}" is ${distance.toFixed(2)} miles from the headquarters.`);
            total_miles += distance;
        }
        console.log(`The total miles for the day is ${total_miles.toFixed(2)} miles.`);
        console.log("________________________________________________________________");
    }
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

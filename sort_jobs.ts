// Here we are importing JOB LIST from the constansts.ts file 
//importing all us to take the data inside a file and import it into another
import { JOBS_LIST } from "./constants";



/* In the code below we will use const which is a key word used to declare
a constant variable.

Meaning you cannot re-assign a new value to it. 

So below we are saying START_POINT: is equalt to Iaddress which is an 
object that has the following values: 
street: ""...""
city ""...""
state: ""...""
country: ""...""
zip: "..."
*/ 
const START_POINT: IAddress = {
    street: "6050 JFK Blvd E",
    city: "Springfield",
    state: "IL",
    country: "USA",
    zip: "62701"
};

/* 
Here we are defining the structure of an object and make it available for use in other files
What `interface` does is = is defines what properties and types ab object should have 
What export does is it makes this intercae availavle for import in other files
This `IAddress` says that any object of type `IAddress` should have {string, city, state, country, zip}
*/
export interface IAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

/*
Here we are defining the structure of an object and make it available for use in other files
What `interface` does is = is defines what properties and types ab object should have 
What export does is it makes this intercae availavle for import in other files
This `IJob` says that any object of type `IJob` should have {address, name, duration}
*/
export interface IJob {
    address: IAddress;
    name: string;
    duration: number;
}



// Function to get a random integer between min and max (inclusive)
function randomNumber(address_one: IAddress, address_two: IAddress): number {
    return getRandomInt(1, 50);
}
// Function to simulate getting a random distance (in miles) between two addresses


/*
Here we are defining a function called `getRandomInt` that take two arguments, `min` and `max`, both of tpye `number`
We then return a `number` 
 */
function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    // Math.ceil(min) rounds `min` up to the nearest interger.  Ex. Math.ceil(1.2) becomes 2 
    max = Math.floor(max);
    // Math.floor(max): Rounds max down to the nearest integer. For example, Math.floor(4.9) becomes 4
    return Math.floor(Math.random() * (max - min + 1)) + min; 
    // Math.floor(...)`: Rounds the scaled number down to the nearest integer. This converts the floating-point number to an integer.
    // Math.random(): Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
    // Math.random() * (max - min + 1): Scales this random number to a range from 0 to max - min + 1. The + 1 ensures that the maximum value is inclusive.
    //+ min: Shifts the range from 0 - (max - min) to min - max. This ensures that the resulting integer falls within the specified range, inclusive of both min and max.
    
    /*Example
    let's say min = 5 and max = 10.
    Math.ceil(5) remains 5.
    Math.floor(10) remains 10.
    The random number is generated as follows:
    Math.random() might generate a number like 0.7.
    0.7 * (10 - 5 + 1) equals 0.7 * 6 which is 4.2
    Math.floor(4.2) is 4.
    Adding min, 4 + 5 gives 9.
    Thus, getRandomInt(5, 10) might return 9. Each call to getRandomInt will return a different random integer between 5 and 10, inclusive.
    */


}

function main(jobs_list: IJob[], start_point: IAddress) {
    console.log("____________________________________________________________________________________________________________");
    console.log("Here we will print our entire list of all the jobs in our job list from constants.ts");
    console.log(" ");
    // Print headers for the job list

    let current_job: IJob = jobs_list[0];
    // Initialize the current location to the start point

    // Create a copy of the jobs list to work with
    let nearest_jobs: IJob[] = jobs_list.splice(1)

    const completed_jobs: IJob[] = [current_job]

    while (nearest_jobs.length > 0) {
        // Initialize variables to track the nearest job and the shortest distance
        let nearest_job_index = -1;
        let shortest_distance = Number.MAX_SAFE_INTEGER;
        // Continue looping as long as there are jobs in the nearest_jobs list

        console.log("Current at job: ", current_job.name)

        nearest_jobs.forEach((job, index) => {
        // Loop through each job in the nearest_jobs list

            const distance = randomNumber(current_job.address, job.address);
            console.log("   Distance to job", job.name, "is", distance, "miles" )
            // Calculate the distance from the current location to the job's address
            
            if (distance < shortest_distance) {
            // If the calculated distance is shorter than the current shortest distance
                shortest_distance = distance;
                // Update the shortest distance to this new shorter distance

                nearest_job_index = index;
                // Update the nearest job index to the current job's index
            }
        });


        // We are initializing an array to store the indices of removed jobs
        if (nearest_job_index !== -1 && nearest_jobs[nearest_job_index]) {
            const nearest_job = nearest_jobs[nearest_job_index];
            console.log(`     Nearest job: ${nearest_job.name}, Distance: ${shortest_distance} miles`);
            // If a nearest job is found, log its details and distance

            // nearest_jobs = nearest_jobs.filter(job => job !== current_job)

            current_job = nearest_job;
            // Update the current location to the nearest job's location

            // Remove the nearest job from the list
            let removingdata = nearest_jobs.splice(nearest_job_index, 1);
        
            completed_jobs.push(removingdata[0])

        }
    }

    console.log('___________________________________________________');
    console.log('Completed jobs: ',completed_jobs);



   
}

main(JOBS_LIST, START_POINT);

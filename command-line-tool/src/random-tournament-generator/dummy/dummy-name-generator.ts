export class RandomNameGenerator {
    private static maleFirstNames = ["Wade", "Dave", "Seth", "Ivan", "Riley", "Gilbert", "Jorge", "Dan", "Brian", "Roberto", "Ramon", "Miles", "Liam", "Nathaniel", "Ethan", "Lewis", "Milton", "Claude", "Joshua", "Glen", "Harvey", "Blake", "Antonio", "Connor", "Julian", "Aidan", "Harold", "Conner", "Peter", "Hunter", "Eli", "Alberto", "Carlos", "Shane", "Aaron", "Marlin", "Paul", "Ricardo", "Hector", "Alexis", "Adrian", "Kingston", "Douglas", "Gerald", "Joey", "Johnny", "Charlie", "Scott", "Martin", "Tristin", "Troy", "Tommy", "Rick", "Victor", "Jessie", "Neil", "Ted", "Nick", "Wiley", "Morris", "Clark", "Stuart", "Orlando", "Keith", "Marion", "Marshall", "Noel", "Everett", "Romeo", "Sebastian", "Stefan", "Robin", "Clarence", "Sandy", "Ernest", "Samuel", "Benjamin", "Luka", "Fred", "Albert", "Greyson", "Terry", "Cedric", "Joe", "Paul", "George", "Bruce", "Christopher", "Mark", "Ron", "Craig", "Philip", "Jimmy", "Arthur", "Jaime", "Perry", "Harold", "Jerry", "Shawn", "Walter"];
    private static femaleFirstNames = ["Daisy", "Deborah", "Isabel", "Stella", "Debra", "Beverly", "Vera", "Angela", "Lucy", "Lauren", "Janet", "Loretta", "Tracey", "Beatrice", "Sabrina", "Melody", "Chrysta", "Christina", "Vicki", "Molly", "Alison", "Miranda", "Stephanie", "Leona", "Katrina", "Mila", "Teresa", "Gabriela", "Ashley", "Nicole", "Valentina", "Rose", "Juliana", "Alice", "Kathie", "Gloria", "Luna", "Phoebe", "Angelique", "Graciela", "Gemma", "Katelynn", "Danna", "Luisa", "Julie", "Olive", "Carolina", "Harmony", "Hanna", "Anabelle", "Francesca", "Whitney", "Skyla", "Nathalie", "Sophie", "Hannah", "Silvia", "Sophia", "Della", "Myra", "Blanca", "Bethany", "Robyn", "Traci", "Desiree", "Laverne", "Patricia", "Alberta", "Lynda", "Cara", "Brandi", "Janessa", "Claudia", "Rosa", "Sandra", "Eunice", "Kayla", "Kathryn", "Rosie", "Monique", "Maggie", "Hope", "Alexia", "Lucille", "Odessa", "Amanda", "Kimberly", "Blanche", "Tyra", "Helena", "Kayleigh", "Lucia", "Janine", "Maribel", "Camille", "Alisa", "Vivian", "Lesley", "Rachelle", "Kianna"];
    private static commonSureNames = ["Williams", "Harris", "Thomas", "Robinson", "Walker", "Scott", "Nelson", "Mitchell", "Morgan", "Cooper", "Howard", "Davis", "Miller", "Martin", "Smith", "Anderson", "White", "Perry", "Clark", "Richards", "Wheeler", "Warburton", "Stanley", "Holland", "Terry", "Shelton", "Miles", "Lucas", "Fletcher", "Parks", "Norris", "Guzman", "Daniel", "Newton", "Potter", "Francis", "Erickson", "Norman", "Moody", "Lindsey", "Gross", "Sherman", "Simon", "Jones", "Brown", "Garcia", "Rodriguez", "Lee", "Young", "Hall", "Allen", "Lopez", "Green", "Gonzalez", "Baker", "Adams", "Perez", "Campbell", "Shaw", "Gordon", "Burns", "Warren", "Long", "Mcdonald", "Gibson", "Ellis", "Fisher", "Reynolds", "Jordan", "Hamilton", "Ford", "Graham", "Griffin", "Russell", "Foster", "Butler", "Simmons", "Flores", "Bennett", "Sanders", "Hughes", "Bryant", "Patterson", "Matthews", "Jenkins", "Watkins", "Ward", "Murphy", "Bailey", "Bell", "Cox", "Martinez", "Evans", "Rivera", "Peterson", "Gomez", "Murray", "Tucker", "Hicks", "Crawford", "Mason", "Rice", "Black", "Knight", "Arnold", "Wagner", "Mosby", "Ramirez", "Coleman", "Powell", "Singh", "Patel", "Wood", "Wright", "Stephens", "Eriksen", "Cook", "Roberts", "Holmes", "Kennedy", "Saunders", "Fisher", "Hunter", "Reid", "Stewart", "Carter", "Phillips", "Spencer", "Howell", "Alvarez", "Little", "Jacobs", "Foreman", "Knowles", "Meadows", "Richmond", "Valentine", "Dudley", "Woodward", "Weasley", "Livingston", "Sheppard", "Kimmel", "Noble", "Leach", "Gentry", "Lara", "Pace", "Trujillo", "Grant"];

    maleName(): string {
        return this.maleFirstName() + " " + this.commonSureName()
    }

    femaleName(): string {
        return this.femaleFirstName() + " " + this.commonSureName()
    }

    femaleFirstName(): string {
        return RandomNameGenerator.femaleFirstNames[Math.floor(Math.random() * RandomNameGenerator.femaleFirstNames.length)];
    }

    maleFirstName(): string {
        return RandomNameGenerator.maleFirstNames[Math.floor(Math.random() * RandomNameGenerator.maleFirstNames.length)];
    }

    commonSureName(): string {
        return RandomNameGenerator.commonSureNames[Math.floor(Math.random() * RandomNameGenerator.commonSureNames.length)];
    }
}

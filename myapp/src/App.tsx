function App() {
  const name: string = "Rahul";
  let age: number = 26;
  let isTeacher: boolean = false;

  let colors: string[] = ["pink", "orange", "purple"];

  let teacher = new Person();

  teacher.name = name;
  teacher.age = 39;
  teacher.isTeacher = isTeacher;

  let people: Person[] = [
      { name: teacher.name, age: teacher.age, isTeacher: teacher.isTeacher},
      { name: "Jane", age: 28, isTeacher: false },
      { name: "Sam", age: 42, isTeacher: false },
      ];

  let message: string = "Start"

  let score: number = 70;
  if (score > 60) {
    message = "Pass";
  } else {
    message = "Try Again";
  }

  let isActive: boolean = true;

  while(isActive) {
    message = "Loop";
    isActive = false;
  }

  let loops: number = 0;
  for(; loops < 3;) {
    loops = loops + 1;
  }

  let sum: number = Multiply(5, 10);

  return (
    <div>
      <div>
      <label>Name:</label>
      <input></input>
      </div>
      <div>
      <button>Submit</button>
      </div>
    </div>
  )

}


//Loop #1 - start -- > Loops = 0, 0 < 3 = true, end -- > loops = 1
//Loop #2 - start -- > Loops = 1, 1 < 3 = true, end -- > loops = 2
//Loop #3 - start -- > Loops = 2, 2 < 3 = true, end -- > loops = 3
//Loop #4 - start -- > Loops = 3, 3 < 3 = false, end -- > loops = 3

class Person {
    name!: string;
    age!: number;
    isTeacher!: boolean;
  }

  function Multiply(num1: number, num2: number): number {
    return num1 * num2;
  }

  function printScore(parameter: string) : string {
    try {
      let score: number = Number(parameter);

      if(isNaN(score)) {
        throw new Error("Not a number");
      }

      return String(score);
    }  catch (error) {
      return String(error);
    }
  }
  





export default App;

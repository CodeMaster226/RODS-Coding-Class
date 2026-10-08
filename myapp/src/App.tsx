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
      { name: "Rob", age: 39, isTeacher: true },
      { name: "Jane", age: 28, isTeacher: false },
      { name: "Sam", age: 42, isTeacher: false },
      ];

  return people[0].name;
}
class Person {
    name!: string;
    age!: number;
    isTeacher!: boolean;
  }

export default App;

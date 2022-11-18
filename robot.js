const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketpalce-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

let buildGraph = (edges) => {
  let graph = Object.create(null); // create a null object.

  let addEdge = (from, to) => {
    //This function takes two inputs a from and a to.
    if (graph[from] == null) {
      //checks to see if our start is in the object.
      graph[from] = [to]; //if not mape the from key to an array of places you can reach from there.
    } else {
      graph[from].push(to); //if from exists push the destination to the array holding locations you can get to.
    }
  };

  for (let [from, to] of edges.map((r) => r.split("-"))) {
    //split the array on - and map the parts as from and to.
    addEdge(from, to); //run the add edge function with all the start points
    addEdge(to, from); //map the other side for completeness
  }

  return graph; //return the object now full of key values of starting location with arrays of destinations you can get to.
};

const roadGraph = buildGraph(roads);
// let roadGraphString = JSON.stringify(roadGraph); //this is just a stringified version of the graph for error checking.
// console.log(roadGraphString);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter((p) => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

let runRobot = (state, robot, memory) => {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
};

let randomPick = (array) => {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
};

let randomRobot = (state) => {
  return { direction: randomPick(roadGraph[state.place]) };
};

VillageState.random = (parcelCount = 5) => {
  let parcels = [];

  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState("Post Office", parcels);
};

runRobot(VillageState.random(), randomRobot);

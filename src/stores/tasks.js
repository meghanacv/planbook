import { list } from "postcss";
import { writable, get } from "svelte/store";

const DEFAULT_DATA = [
  {
    id: "l-1",
    text: "List 1",
    items: [
      { id: "t-1", text: "Task 1" },
      { id: "t-2", text: "Task 2" },
      { id: "t-3", text: "Task 3" }
    ]
  },
  {
    id: "l-2",
    text: "List 2",
    items: [
      { id: "t-4", text: "Task 4" },
      { id: "t-5", text: "Task 5" },
      { id: "t-6", text: "Task 6" }
    ]
  },
  {
    id: "l-3",
    text: "List 3",
    items: [
      { id: "t-7", text: "Task 7" },
      { id: "t-8", text: "Task 8" },
      { id: "t-9", text: "Task 9" }
    ]
  }
];

function createStore() {
  const storedList = localStorage.getItem("task-manager-store");

  const _taskList = storedList ? JSON.parse(storedList) : DEFAULT_DATA;

  const taskList = writable(DEFAULT_DATA);
  const { subscribe, update } = taskList;
  return {
    subscribe,
    updateTask: (task, listIdx) => {
      update((list) => {
        const taskIdx = get(taskList)[listIdx].items.findIndex((item) => item.id === task.id);
        if (taskIdx > -1) {
          list[listIdx].items[taskIdx] = { ...task };
        }
        return list;
      });
    },
    addList: () => {
      update((list) => [
        ...list,
        {
          id: new Date().toISOString(),
          text: "New list",
          items: []
        }
      ]);
    },
    addTask: (listIdx) => {
      update((list) => {
        const { items } = list[listIdx];
        list[listIdx].items = [
          ...items,
          {
            id: new Date().toISOString(),
            text: "Add Task"
          }
        ];
        return list;
      });
    },
    moveTask: (sourceData, moveToListIdx) => {
      update((list) => {
        const [task] = list[sourceData.listIdx].items.splice(sourceData.taskIdx, 1);
        list[moveToListIdx].items.push(task);
        return list;
      });
    },
    removeTask: (listIdx, taskIdx) => {
      update((list) => {
        list[listIdx].items.splice(taskIdx, 1);
        return list;
      });
    },
    removeList: (listIdx) => {
      update((list) => {
        list.splice(listIdx, 1);
        return list;
      });
    },
    updateList: (updatedtext, listIdx) => {
      update((list) => {
        list[listIdx].text = updatedtext;
        return list;
      })
    }
  };
}

export const taskListStore = createStore();

taskListStore.subscribe((list) => {
  if (list) {
    localStorage.setItem("task-manager-store", JSON.stringify(list));
  }
});

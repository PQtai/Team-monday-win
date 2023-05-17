export interface IValueOfTask {
   belongColumn: string;
   typeOfValue: string;
   _id: string;
   value: string | null;
   valueId: {
      _id: string;
      value: string | null;
      color: string;
   } | null;
   name: string;
   position: number;
}
export interface ITask {
   _id: string;
   name: string;
   position: number;
   values: IValueOfTask[];
}

export type ResidentStatus = "PAID" | "PENDING" | "OVERDUE";

export interface MockResident {
  id: number;
  flatNumber: string;
  wing: string;
  residentName: string;
  phone: string;
  email: string;
  totalDues: number;
  status: ResidentStatus;
}

export const mockResidents: MockResident[] = [
  {
    id: 1,
    flatNumber: "101",
    wing: "A",
    residentName: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    totalDues: 0,
    status: "PAID",
  },
  {
    id: 2,
    flatNumber: "102",
    wing: "A",
    residentName: "Priya Mehta",
    phone: "9123456780",
    email: "priya@example.com",
    totalDues: 1200,
    status: "PENDING",
  },
  {
    id: 3,
    flatNumber: "201",
    wing: "B",
    residentName: "Arjun Verma",
    phone: "9988776655",
    email: "arjun@example.com",
    totalDues: 2500,
    status: "OVERDUE",
  },
   {
    id: 4,
    flatNumber: "202",
    wing: "B",
    residentName: "Sneha Gupta",
    phone: "9876123456",
    email: "sneha@example.com",
    totalDues: 0,
    status: "PAID",
  },
  {
    id: 5,
    flatNumber: "301",
    wing: "A",
    residentName: "Vikram Singh",
    phone: "9090909090",
    email: "vikram@example.com",
    totalDues: 800,
    status: "PENDING",
  },
];



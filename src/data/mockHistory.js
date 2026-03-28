const USER_PROFILE = {
  name: "Rajan Nair",
  age: 71,
  bloodGroup: "B+",
  currentMedications: [
    {
      id: 1,
      name: "Warfarin",
      dosage: "5mg",
      frequency: "Once daily",
      startDate: "2024-01-15",
      doctor: "Dr. Meera Pillai",
      condition: "Atrial Fibrillation",
    },
    {
      id: 2,
      name: "Metoprolol",
      dosage: "25mg",
      frequency: "Twice daily",
      startDate: "2024-01-15",
      doctor: "Dr. Meera Pillai",
      condition: "Hypertension",
    },
  ],
  prescriptionHistory: [
    {
      id: "RX-001",
      date: "2024-01-15",
      doctor: "Dr. Meera Pillai",
      hospital: "Amrita Hospital, Kochi",
      medications: ["Warfarin 5mg", "Metoprolol 25mg"],
      status: "active",
    },
    {
      id: "RX-002",
      date: "2023-11-02",
      doctor: "Dr. Suresh Kumar",
      hospital: "KIMS Hospital, Thiruvananthapuram",
      medications: ["Amlodipine 5mg", "Atorvastatin 20mg"],
      status: "completed",
    },
    {
      id: "RX-003",
      date: "2023-08-19",
      doctor: "Dr. Priya Menon",
      hospital: "Lakeshore Hospital, Kochi",
      medications: ["Metformin 500mg", "Glimepiride 1mg"],
      status: "completed",
    },
  ],
};

export default USER_PROFILE;

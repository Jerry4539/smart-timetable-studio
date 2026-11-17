# Smart Timetable Studio — School Data Collection Template
> **Instructions for School / Academic Coordinator:**
> Please fill out the tables below with your institution's details. You can copy-paste these tables directly into **Microsoft Excel**, **Google Sheets**, or edit this file directly.
> Once filled, share this back to configure and test the automated timetable generator.

---

## 📋 Sheet 1: Institutional Profile & Bell Schedule

### 1.1 Institution Details
| Field Name | Description | Example / Allowed Values | Your Institution's Data |
| :--- | :--- | :--- | :--- |
| **School / College Name** | Full official name | *Oakridge International Academy* | |
| **Institution Code** | Short 3–5 letter code | *OIA* | |
| **Campus Name** | Branch / Campus location | *Main Campus* | |
| **Academic Year** | Current academic session | *2026-2027* | |
| **Working Days** | Days school operates | *Monday to Friday* (or *Monday to Saturday*) | |
| **Daily Start Time** | School reporting / 1st bell | *08:00 AM* | |
| **Daily End Time** | Final bell / dispersal time | *02:15 PM* | |
| **Regular Period Duration**| Duration of 1 lecture | *45 minutes* (or *40 min*) | |
| **Short Break Duration** | Morning recess duration | *15 minutes* | |
| **Lunch Break Duration** | Lunch recess duration | *45 minutes* | |

---

### 1.2 Daily Bell Schedule (Time Slots)
*Define each period and break in order from morning to afternoon.*

| Slot # | Period Name / Label | Start Time | End Time | Type (`regular` / `short_break` / `lunch` / `assembly`) | Is It a Break? (`Yes` / `No`) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **1** | Period 1 | 08:00 AM | 08:45 AM | `regular` | No |
| **2** | Period 2 | 08:45 AM | 09:30 AM | `regular` | No |
| **—** | Morning Break | 09:30 AM | 09:45 AM | `short_break` | **Yes** |
| **3** | Period 3 | 09:45 AM | 10:30 AM | `regular` | No |
| **4** | Period 4 | 10:30 AM | 11:15 AM | `regular` | No |
| **—** | Lunch Break | 11:15 AM | 12:00 PM | `lunch` | **Yes** |
| **5** | Period 5 | 12:00 PM | 12:45 PM | `regular` | No |
| **6** | Period 6 | 12:45 PM | 01:30 PM | `regular` | No |
| **7** | Period 7 | 01:30 PM | 02:15 PM | `regular` | No |

> 💡 **Note**: In the example above, there are **7 teaching periods** per day. For 5 working days, each division requires $7 \times 5 = \mathbf{35\text{ periods/week}}$ total.

---

## 🏫 Sheet 2: Standards (Grades) & Divisions

*List all grades/classes and the divisions under each grade.*

| Standard / Grade Name | Numeric Level | Division(s) | Full Division Name | Class Teacher / Advisor (Optional) |
| :--- | :---: | :--- | :--- | :--- |
| Grade 9 | 9 | Div A, Div B | Grade 9-A, Grade 9-B | Dr. Rahul Sharma (for 9-A), David Vance (for 9-B) |
| Grade 10 | 10 | Div A, Div B | Grade 10-A, Grade 10-B | Sarah Jenkins (for 10-A), Elena Rostova (for 10-B) |
| | | | | |
| | | | | |
| | | | | |

---

## 📚 Sheet 3: Subjects & Curriculum Requirements

*Define every subject taught, which standards take it, how many periods per week are needed, and constraints.*

| Subject Code | Subject Name | Category (`core` / `lab` / `sports` / `activity` / `language`) | Applicable Standards | Weekly Periods Needed (per division) | Max Periods Per Day | Double Period Allowed? (`Yes` / `No`) | Preferred Color (Optional) |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| **MATH-9** | Mathematics | `core` | Grade 9 | 6 | 2 | No | Blue |
| **ENG-9** | English | `core` | Grade 9 | 5 | 1 | No | Purple |
| **SCI-9** | Integrated Science | `core` | Grade 9 | 6 | 2 | Yes (for practicals) | Green |
| **HIST-9** | World History | `core` | Grade 9 | 4 | 1 | No | Amber |
| **CS-9** | Computer Basics | `lab` | Grade 9 | 4 | 2 | Yes (for lab) | Indigo |
| **MATH-10**| Advanced Math | `core` | Grade 10 | 6 | 2 | No | Blue |
| **ENG-10** | English Literature | `core` | Grade 10 | 5 | 1 | No | Purple |
| **PHY-10** | Physics & Chemistry| `core` | Grade 10 | 6 | 2 | Yes (for practicals) | Teal |
| **GEO-10** | Geography & Civics | `core` | Grade 10 | 4 | 1 | No | Amber |
| **CS-10** | Programming & Web | `lab` | Grade 10 | 4 | 2 | Yes (for lab) | Indigo |
| **PE** | Physical Education | `sports` | Grade 9, Grade 10 | 3 | 1 | No | Coral |
| | | | | | | | |
| | | | | | | | |

> ⚠️ **Sanity Check Rule**: The sum of "Weekly Periods Needed" for all subjects in a standard **must exactly equal** the total teaching periods available in the week (e.g. 35 periods/week).
> *Example for Grade 9: Math (6) + English (5) + Science (6) + History (4) + Computer (4) + PE (3) + Library/Study (7) = 35 periods.*

---

## 👨‍🏫 Sheet 4: Faculty / Teachers Master

*List all faculty members with contact info and workload limits.*

| Emp ID | Faculty Full Name | Designation / Dept | Email (Optional) | Phone (Optional) | Subjects Qualified to Teach | Max Periods / Day | Max Periods / Week | Max Consecutive Periods |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **T-101** | Dr. Rahul Sharma | PGT Mathematics | rahul@school.edu | +91 98765 00001 | Mathematics, Advanced Math | 4 | 20 | 3 |
| **T-102** | Sarah Jenkins | PGT English | sarah@school.edu | +91 98765 00002 | English, English Literature | 4 | 18 | 2 |
| **T-103** | David Vance | PGT Science | david@school.edu | +91 98765 00003 | Integrated Science, Physics | 4 | 20 | 3 |
| **T-104** | Elena Rostova | TGT Social Science| elena@school.edu | +91 98765 00004 | World History, Geography | 4 | 18 | 2 |
| **T-105** | Marcus Chen | CS Faculty | marcus@school.edu| +91 98765 00005 | Computer Basics, Programming | 4 | 18 | 2 |
| **T-106** | Coach Vikram | PE Director | vikram@school.edu| +91 98765 00006 | Physical Education | 3 | 16 | 2 |
| | | | | | | | | |
| | | | | | | | | |

---

## 🎯 Sheet 5: Subject & Teacher Allocation to Divisions (M:N Assignment)
*This tells the timetable generator exactly which teacher takes which subject in which section.*

| Standard | Division | Subject Name | Subject Code | Assigned Teacher Name | Periods / Week |
| :--- | :--- | :--- | :---: | :--- | :---: |
| Grade 9 | 9-A | Mathematics | MATH-9 | Dr. Rahul Sharma | 6 |
| Grade 9 | 9-A | English | ENG-9 | Sarah Jenkins | 5 |
| Grade 9 | 9-A | Integrated Science | SCI-9 | David Vance | 6 |
| Grade 9 | 9-A | World History | HIST-9 | Elena Rostova | 4 |
| Grade 9 | 9-A | Computer Basics | CS-9 | Marcus Chen | 4 |
| Grade 9 | 9-A | Physical Education | PE | Coach Vikram | 3 |
| Grade 9 | 9-B | Mathematics | MATH-9 | Dr. Rahul Sharma | 6 |
| Grade 9 | 9-B | English | ENG-9 | Sarah Jenkins | 5 |
| Grade 9 | 9-B | Integrated Science | SCI-9 | David Vance | 6 |
| Grade 9 | 9-B | World History | HIST-9 | Elena Rostova | 4 |
| Grade 9 | 9-B | Computer Basics | CS-9 | Marcus Chen | 4 |
| Grade 9 | 9-B | Physical Education | PE | Coach Vikram | 3 |
| Grade 10 | 10-A | Advanced Math | MATH-10| Dr. Rahul Sharma | 6 |
| Grade 10 | 10-A | English Literature | ENG-10 | Sarah Jenkins | 5 |
| Grade 10 | 10-A | Physics & Chemistry| PHY-10 | David Vance | 6 |
| Grade 10 | 10-A | Geography & Civics | GEO-10 | Elena Rostova | 4 |
| Grade 10 | 10-A | Programming & Web | CS-10 | Marcus Chen | 4 |
| Grade 10 | 10-A | Physical Education | PE | Coach Vikram | 3 |
| Grade 10 | 10-B | Advanced Math | MATH-10| Dr. Rahul Sharma | 6 |
| Grade 10 | 10-B | English Literature | ENG-10 | Sarah Jenkins | 5 |
| Grade 10 | 10-B | Physics & Chemistry| PHY-10 | David Vance | 6 |
| Grade 10 | 10-B | Geography & Civics | GEO-10 | Elena Rostova | 4 |
| Grade 10 | 10-B | Programming & Web | CS-10 | Marcus Chen | 4 |
| Grade 10 | 10-B | Physical Education | PE | Coach Vikram | 3 |
| | | | | | |

---

## 🔒 Sheet 6: Fixed Slots, Off-Periods & Special Constraints (Optional)
*Use this for special cases like school assembly, part-time teachers, or non-teaching periods.*

| Rule / Constraint Type | Teacher / Class Affected | Day of Week | Period Slot | Details / Reason |
| :--- | :--- | :---: | :---: | :--- |
| **Fixed Slot (Lock)** | All Classes | Monday | Period 1 | Institutional Morning Assembly & Value Education |
| **Teacher Unavailability**| Coach Vikram | Friday | Period 6, 7 | District Sports Council meeting (off campus) |
| **Teacher Unavailability**| Dr. Rahul Sharma | Wednesday | Period 1 | Academic HOD Meeting |
| **Lab Block (Double)** | Grade 10-A | Thursday | Period 4 & 5 | Continuous Physics Lab experiment |
| | | | | |

---

## ✅ Coordinator's Pre-Flight Checklist Before Submitting Data:
1. [ ] **Period math checks out**: Total periods requested for every class equals $( \text{Working Days} \times \text{Daily Teaching Periods} )$.
2. [ ] **Teacher capacity check**: No single teacher is assigned more total periods than their `Max Periods / Week`.
3. [ ] **Double-booking sanity**: If Teacher X has 3 classes, their combined load does not exceed total available periods.
4. [ ] **Subject names & codes**: Consistent spelling across all sheets.

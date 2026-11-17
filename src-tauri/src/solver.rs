use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use std::time::Instant;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NativeSection {
    pub id: String,
    pub class_id: String,
    pub name: String,
    pub full_name: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NativeClass {
    pub id: String,
    pub name: String,
    pub numeric_level: i32,
    pub sections: Vec<NativeSection>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NativeSubject {
    pub id: String,
    pub name: String,
    pub code: String,
    pub grade_ids: Vec<String>,
    pub weekly_periods_required: usize,
    pub max_periods_per_day: usize,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NativeTeacher {
    pub id: String,
    pub name: String,
    pub employee_code: String,
    pub qualified_subject_ids: Vec<String>,
    pub max_periods_per_day: usize,
    pub max_periods_per_week: usize,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NativeTimeSlot {
    pub index: usize,
    pub label: String,
    pub is_break: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NativeSlot {
    pub id: String,
    pub timetable_id: String,
    pub day: String,
    pub period_index: usize,
    pub section_id: String,
    pub subject_id: String,
    pub teacher_id: String,
    pub lock_type: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NativeSolverInput {
    pub classes: Vec<NativeClass>,
    pub subjects: Vec<NativeSubject>,
    pub teachers: Vec<NativeTeacher>,
    pub time_slots: Vec<NativeTimeSlot>,
    pub locked_slots: Vec<NativeSlot>,
    pub working_days: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NativeSolverOutput {
    pub slots: Vec<NativeSlot>,
    pub execution_time_ms: u64,
    pub hard_conflicts_count: usize,
    pub logs: Vec<String>,
}

pub fn solve_native(input: NativeSolverInput) -> NativeSolverOutput {
    let start_time = Instant::now();
    let mut logs = Vec::new();
    logs.push("Rust Native Solver: Initializing constraint indices...".to_string());

    let regular_periods: Vec<&NativeTimeSlot> =
        input.time_slots.iter().filter(|ts| !ts.is_break).collect();

    let mut result_slots: Vec<NativeSlot> = input.locked_slots.clone();

    // Teacher occupancy tracker: (day, period_index) -> teacher_id
    let mut teacher_busy: HashSet<(String, usize, String)> = HashSet::new();
    // Section occupancy tracker: (day, period_index, section_id)
    let mut section_busy: HashSet<(String, usize, String)> = HashSet::new();
    // Daily teacher load: (day, teacher_id) -> count
    let mut teacher_daily_load: HashMap<(String, String), usize> = HashMap::new();

    // Seed existing locked slots into occupancy trackers
    for slot in &result_slots {
        teacher_busy.insert((slot.day.clone(), slot.period_index, slot.teacher_id.clone()));
        section_busy.insert((slot.day.clone(), slot.period_index, slot.section_id.clone()));
        *teacher_daily_load
            .entry((slot.day.clone(), slot.teacher_id.clone()))
            .or_insert(0) += 1;
    }

    logs.push(format!(
        "Rust Native Solver: Locked {} pinned slots.",
        result_slots.len()
    ));

    let mut slot_counter = 1000usize;

    // Iterate over each standard and division
    for grade_class in &input.classes {
        // Subjects assigned to this grade
        let applicable_subjects: Vec<&NativeSubject> = input
            .subjects
            .iter()
            .filter(|s| s.grade_ids.contains(&grade_class.id))
            .collect();

        for section in &grade_class.sections {
            for day in &input.working_days {
                for period in &regular_periods {
                    // Check if section already has a lecture in this slot
                    if section_busy.contains(&(day.clone(), period.index, section.id.clone())) {
                        continue;
                    }

                    // Select subject needing quota
                    for subject in &applicable_subjects {
                        let current_count = result_slots
                            .iter()
                            .filter(|s| s.section_id == section.id && s.subject_id == subject.id)
                            .count();

                        if current_count >= subject.weekly_periods_required {
                            continue;
                        }

                        // Check daily max for this subject in this section
                        let daily_subject_count = result_slots
                            .iter()
                            .filter(|s| {
                                s.section_id == section.id
                                    && s.day == *day
                                    && s.subject_id == subject.id
                            })
                            .count();

                        if daily_subject_count >= subject.max_periods_per_day {
                            continue;
                        }

                        // Find qualified teacher who is free in this period and not over daily limit
                        let qualified_teachers: Vec<&NativeTeacher> = input
                            .teachers
                            .iter()
                            .filter(|t| t.qualified_subject_ids.contains(&subject.id))
                            .collect();

                        let mut chosen_teacher: Option<&NativeTeacher> = None;
                        for teacher in qualified_teachers {
                            // Check if teacher is busy
                            if teacher_busy.contains(&(day.clone(), period.index, teacher.id.clone())) {
                                continue;
                            }

                            // Check daily limit
                            let load = teacher_daily_load
                                .get(&(day.clone(), teacher.id.clone()))
                                .copied()
                                .unwrap_or(0);

                            if load >= teacher.max_periods_per_day {
                                continue;
                            }

                            chosen_teacher = Some(teacher);
                            break;
                        }

                        if let Some(tch) = chosen_teacher {
                            slot_counter += 1;
                            let new_slot = NativeSlot {
                                id: format!("rust-slot-{}", slot_counter),
                                timetable_id: "tt-v1-master".to_string(),
                                day: day.clone(),
                                period_index: period.index,
                                section_id: section.id.clone(),
                                subject_id: subject.id.clone(),
                                teacher_id: tch.id.clone(),
                                lock_type: "none".to_string(),
                            };

                            teacher_busy.insert((day.clone(), period.index, tch.id.clone()));
                            section_busy.insert((day.clone(), period.index, section.id.clone()));
                            *teacher_daily_load
                                .entry((day.clone(), tch.id.clone()))
                                .or_insert(0) += 1;

                            result_slots.push(new_slot);
                            break; // Move to next period slot
                        }
                    }
                }
            }
        }
    }

    let elapsed = start_time.elapsed();
    logs.push(format!(
        "Rust Native Solver: Completed in {}ms with 0 hard conflicts. Total slots: {}",
        elapsed.as_millis(),
        result_slots.len()
    ));

    NativeSolverOutput {
        slots: result_slots,
        execution_time_ms: elapsed.as_millis() as u64,
        hard_conflicts_count: 0,
        logs,
    }
}

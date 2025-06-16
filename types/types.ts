export type Semester = {
    semester_id: string;
    name: string;
    capacity: string;
    subjects: string;
    isActive: string;
    year: string;
    student_count?: number;
};

export type Student = {
    email?: string;
    name?: string;
    roll?: string;
    semester?: string;
    student_id?: number;
}

import { Request, Response } from "express";
import { AppDataSource } from "../route/data-source";
import { TaskRepository } from "../repository/task-repository";
import { Task } from "../modules/task-entity";
import { Users } from "../modules/user-entity";

export const collaboratorsTaskArray: Array<{ full_name: string; email: string }> = [];

export const createTaskDisplay = async (request: Request, response: Response) => {
    const { title, description, deadline, assigneesArray } = request.body;
        response.render('create-task',{title, description, deadline, assigneesArray: assigneesArray});
}


export const createTask = async (request: Request, response: Response) => {
    const { title, description, deadline, assignees } = request.body;

    try {
        const connection = AppDataSource;
        const taskRepository = connection.getRepository(Task);
        const userRepository = connection.getRepository(Users);

        // Create a new task
        if (Array.isArray(assignees)) {
        const task = new Task();
        task.title = title;
        task.description = description;
        task.deadline = deadline;

        // Look up and validate assignees by ID
        const assigneesArray = [];
        for (const assigneeId of assignees) {
            const assignee = await userRepository.findOne(assigneeId);
            console.log(assignee);
            if (!assignee) {
                return response.status(404).json({ message: `Assignee not found for ID: ${assigneeId}` });
            }

            // Assign the assignee to the task
            task.assignee = assignee;

            // Save the task with the assignee assignment
            await taskRepository.save(task);

            // Push the assignee to the array
            assigneesArray.push(assignee);
        }

        response.status(201).json({ message: 'Task created successfully', assigneesArray });
    } else {
        response.status(400).json({ message: 'Invalid format for assignees' });
    }
        
    } catch (error) {
        console.error('Error creating task:', error);
        response.status(500).send('Internal Server Error');
    }
};


export const addAssignee = async (request: Request, response: Response) => {
    const  assigneesArray  = request.body;
    const assigneeIds: number[] = [];

    try {
        const connection = AppDataSource;
        const userRepository = connection.getRepository(Users);

        // Retrieve the assignee IDs from the database and validate their existence
        for (const assignee of assigneesArray) {
            if (!assignee.email) {
                return response.status(400).json({ message: 'Invalid format for assigneesArray' });
            }

            const existingAssignee = await userRepository.findOne({ where: { email: assignee.email } });

            if (!existingAssignee) {
                return response.status(404).json({ message: `Assignee not found for email: ${assignee.email}` });
            }

            assigneeIds.push(existingAssignee.id);
        }

        response.status(201).json({ message: 'Assignees added successfully', assigneeIds });
    } catch (error) {
        console.error('Error adding assignees:', error);
        response.status(500).send('Internal Server Error');
    }
};







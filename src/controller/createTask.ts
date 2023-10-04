import { Request, Response } from "express";
import { AppDataSource } from "../route/data-source";
import { TaskRepository } from "../repository/task-repository";
import { Task } from "../modules/task-entity";
import { Users } from "../modules/user-entity";

export const collaboratorsTaskArray: Array<{ full_name: string; email: string }> = [];

export const createTaskDisplay = async (request: Request, response: Response) => {
    const { title, description, deadline, assigneesArray } = request.body;

    const { fullName, email } = request.session;
        console.log(fullName);
        if (!fullName || !email) {
          response.redirect('/login'); // Redirect to the login page if fullName or email is missing
          return;
        }

        response.render('create-task',{fullName, email, title, description, deadline, assigneesArray: assigneesArray});
}

export const createTask = async (request: Request, response: Response) => {
    const { title, description, deadline, assignees } = request.body;
  
    try {
      // Validate input data here if needed
  
      const connection = AppDataSource;
      const taskRepository = connection.getRepository(Task);
      const userRepository = connection.getRepository(Users);
  
      // Ensure assignees is an array of IDs
      const assigneeIds = Array.isArray(assignees) ? assignees : [assignees];
  
      // Look up and validate assignees by ID
      const assigneesArray = await userRepository.findByIds(assigneeIds);
  
      // Create a new task
      const task = new Task();
      task.title = title;
      task.description = description;
      task.deadline = deadline;
      task.assignees = assigneesArray; // Assign the array of assignees
  
      // Save the task with the assignee assignment
      await taskRepository.save(task);
  
      response.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
      console.error('Error creating task:', error);
      response.status(500).send('Internal Server Error');
    }
  };
  
  
  


export const addAssignee = async (request: Request, response: Response) => {
    const assigneesEmails = Array.isArray(request.body.assignees) ? request.body.assignees : [request.body.assignees];
    const assigneeIds: number[] = [];
    const assigneesArray = [];

    try {
        const connection = AppDataSource;
        const userRepository = connection.getRepository(Users);

        const {fullName, email} = request.session;


        for (const email of assigneesEmails) {
            // Check if the email exists in the database
            const existingAssignee = await userRepository.findOne({ where: { email } });

            if (!existingAssignee) {
                return response.status(404).json({ message: `Assignee not found for email: ${email}` });
            }

            assigneeIds.push(existingAssignee.id);
            
            assigneesArray.push({
                full_name: existingAssignee.full_name,
                email: existingAssignee.email
            });
        }
        response.render('create-task', {assigneesEmails,fullName, email, assigneesArray})

        // response.status(201).json({ message: 'Assignees added successfully', assigneeIds });
    } catch (error) {
        console.error('Error adding assignees:', error);
        response.status(500).send('Internal Server Error');
    }
};








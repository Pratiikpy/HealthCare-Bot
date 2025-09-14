import React, { useState } from 'react';
import { Button } from './common/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './common/Card';

// TODO: Replace this with data fetched from your backend API.
const dummyUsers = [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', joined: '2023-10-26' },
    { id: 'u2', name: 'Bob Williams', email: 'bob@example.com', joined: '2023-10-25' },
    { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', joined: '2023-10-24' },
    { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', joined: '2023-10-23' },
];

// TODO: Replace this with data fetched from your backend API.
const dummyQA = [
    { id: 'q1', keyword: 'headache', question: 'What to do for a headache?', answer: 'Rest, drink water, and take over-the-counter pain relievers. Consult a doctor if it persists.' },
    { id: 'q2', keyword: 'fever', question: 'I have a fever, what should I do?', answer: 'Rest, stay hydrated, and monitor your temperature. See a doctor if it is very high or lasts more than a few days.' },
    { id: 'q3', keyword: 'cough', question: 'How to treat a persistent cough?', answer: 'Drink warm fluids like tea with honey. Use a humidifier. Consult a doctor if it doesn\'t improve.' },
];

const AdminDashboard: React.FC = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [trainingComplete, setTrainingComplete] = useState(false);

    const handleTrainModel = () => {
        // TODO: This is a simulation. In a real app, this would trigger a backend process.
        setIsTraining(true);
        setTrainingComplete(false);
        setTimeout(() => {
            setIsTraining(false);
            setTrainingComplete(true);
             setTimeout(() => setTrainingComplete(false), 3000);
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Questions & Answers</CardTitle>
                    <CardDescription>Add, edit, or delete the Q&A data used by the bot.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {/* TODO: This should be populated with real data from the API */}
                        {dummyQA.map(qa => (
                            <div key={qa.id} className="p-3 bg-slate-100 rounded-md">
                                <p className="font-semibold text-slate-800">{qa.question}</p>
                                <p className="text-sm text-slate-600 mt-1">{qa.answer}</p>
                                <div className="text-xs text-teal-600 mt-2">Keyword: <span className="font-mono bg-teal-100 px-1 rounded">{qa.keyword}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-2 mt-4">
                        {/* TODO: Implement the 'Add New Q&A' functionality with a form/modal and API call. */}
                        <Button>Add New Q&A</Button>
                        <Button variant="secondary" onClick={handleTrainModel} disabled={isTraining}>
                            {isTraining ? 'Training...' : 'Train Model'}
                        </Button>
                    </div>
                    {trainingComplete && <p className="mt-4 text-green-600">Model training completed successfully!</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Users</CardTitle>
                    <CardDescription>View all users who have registered in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                         {/* TODO: This should be populated with real data from the API */}
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyUsers.map(user => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{user.name}</th>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
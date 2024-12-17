import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./expensetracker.css";
import { NotebookTabs } from "lucide-react";

const ExpenseTrackerUrl = import.meta.env.VITE_FireBaseExpenseTracker_URL;

const ExpenseTracker = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [expenseDesc, setExpenseDesc] = useState("");
    const [expenseAmt, setExpenseAmt] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("food");
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [editItemId, setEditItemId] = useState(null);
    const [editDesc, setEditDesc] = useState("");
    const [editAmt, setEditAmt] = useState("");
    const [editCat, setEditCat] = useState("food");

    const userId = localStorage.getItem("userId");

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(
                `${ExpenseTrackerUrl}/${userId}.json`
            );
            const fetchedData = [];
            for (const key in response.data) {
                fetchedData.push({ id: key, ...response.data[key] });
            }
            setExpenses(fetchedData);
            const totalAmount = fetchedData.reduce(
                (total, expense) => total + parseFloat(expense.amount),
                0
            );
            setExpenseTotal(totalAmount);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    };

    useEffect(() => {
        if (userId) fetchExpenses();
    }, [userId]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const newExpense = {
            description: expenseDesc,
            amount: parseFloat(expenseAmt),
            category: expenseCategory,
        };
        try {
            await axios.post(
                `${ExpenseTrackerUrl}/${userId}.json`,
                newExpense
            );
            fetchExpenses();
        } catch (err) {
            console.error("Error adding expense:", err);
        }
        setExpenseDesc("");
        setExpenseAmt("");
    };

    const handleExpenseDelete = async (deleteItemID) => {
        try {
            await axios.delete(
                `${ExpenseTrackerUrl}/${userId}/${deleteItemID}.json`
            );
            fetchExpenses();
        } catch (error) {
            console.error("Error deleting the item:", error);
        }
    };

    const handleEditClick = (item) => {
        setEditItemId(item.id);
        setEditDesc(item.description);
        setEditAmt(item.amount);
        setEditCat(item.category);
    };

    const handleExpenseEdit = async (e) => {
        e.preventDefault();
        const updatedExpense = {
            description: editDesc,
            amount: parseFloat(editAmt),
            category: editCat,
        };
        try {
            await axios.put(
                `${ExpenseTrackerUrl}/${userId}/${editItemId}.json`,
                updatedExpense
            );
            fetchExpenses();
            setEditItemId(null);
        } catch (error) {
            console.error("Error editing the item:", error);
        }
    };

    return (
        <div className="expense-tracker-container">
            <h1>
                Start Tracking Your Expense <NotebookTabs />
            </h1>
            <button className="expense-tracker-back-btn" onClick={() => navigate(-1)}>
                Back
            </button>
            <form className="expense-tracker-form" onSubmit={handleAddExpense}>
                <input
                    type="text"
                    required
                    placeholder="Expense Description"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                />
                <input
                    type="number"
                    required
                    placeholder="Expense Amount"
                    value={expenseAmt}
                    onChange={(e) => setExpenseAmt(e.target.value)}
                />
                <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                >
                    <option value="food">Food</option>
                    <option value="groceries">Groceries</option>
                    <option value="transportation">Transportation (Petrol, Public Transport)</option>
                    <option value="housing">Housing (Rent, Mortgage, Utilities)</option>
                    <option value="entertainment">Entertainment (Movies, Gaming)</option>
                    <option value="shopping">Shopping (Clothing, Electronics)</option>
                    <option value="health">Health (Gym, Medications)</option>
                    <option value="education">Education (Tuition, Books)</option>
                    <option value="travel">Travel (Flights, Hotels)</option>
                    <option value="personal_care">Personal Care</option>
                    <option value="gifts_donations">Gifts and Donations</option>
                    <option value="bills_fees">Bills and Fees</option>
                    <option value="miscellaneous">Miscellaneous</option>
                </select>
                <button type="submit">Add Expense</button>
            </form>

            {expenses.length > 0 ? (
                <div className="expense-tracker-table-container">
                    {expenses.map((item) => (
                        <div className="expense-card" key={item.id}>
                            {editItemId === item.id ? (
                                <form onSubmit={handleExpenseEdit}>
                                    <input
                                        type="text"
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={editAmt}
                                        onChange={(e) => setEditAmt(e.target.value)}
                                    />
                                    <select
                                        value={editCat}
                                        onChange={(e) => setEditCat(e.target.value)}
                                    >
                                        <option value="food">Food</option>
                                        <option value="groceries">Groceries</option>
                                        <option value="transportation">Transportation</option>
                                        <option value="housing">Housing</option>
                                        <option value="entertainment">Entertainment</option>
                                        <option value="shopping">Shopping</option>
                                        <option value="health">Health</option>
                                        <option value="education">Education</option>
                                        <option value="travel">Travel</option>
                                        <option value="personal_care">Personal Care</option>
                                        <option value="gifts_donations">Gifts and Donations</option>
                                        <option value="bills_fees">Bills and Fees</option>
                                        <option value="miscellaneous">Miscellaneous</option>
                                    </select>
                                    <button type="submit">Save</button>
                                </form>
                            ) : (
                                <>
                                    <div>
                                        <strong>Description:</strong> {item.description}
                                    </div>
                                    <div>
                                        <strong>Amount:</strong> ₹{item.amount}
                                    </div>
                                    <div>
                                        <strong>Category:</strong> {item.category}
                                    </div>
                                    <div className="expense-actions">
                                        <button onClick={() => handleEditClick(item)}>Edit</button>
                                        <button onClick={() => handleExpenseDelete(item.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    <h2>Your Expenses Total to: ₹{expenseTotal}</h2>
                </div>
            ) : (
                <h2 className="expense-tracker-no-items">No Items Added Yet!</h2>
            )}
        </div>
    );
};

export default ExpenseTracker;


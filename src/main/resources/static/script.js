const API_URL = "/api/leaves";

async function applyLeave() {
let name = document.getElementById("name").value.trim();
let empid = document.getElementById("empid").value.trim();
let leave = document.getElementById("leaveType").value;
let from = document.getElementById("fromDate").value;
let to = document.getElementById("toDate").value;
let reason = document.getElementById("reason").value.trim();


if (name === "" || empid === "" || leave === "" ||
    from === "" || to === "" || reason === "") {
    alert("Please fill all fields");
    return;
}

if (to < from) {
    alert("To Date must be on or after From Date");
    return;
}

const leaveData = {
    employeeName: name,
    employeeId: empid,
    leaveType: leave,
    fromDate: from,
    toDate: to,
    reason: reason
};

try {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(leaveData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save leave");
    }

    alert("Leave Applied Successfully!");

    document.getElementById("name").value = "";
    document.getElementById("empid").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("reason").value = "";

    await loadLeaves();

} catch (error) {
    console.error("Leave submission error:", error);
    alert("Unable to save leave. Check the browser Console and Spring Boot terminal.");
}


}

async function loadLeaves() {
try {
const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to load leave history");
    }

    const leaves = await response.json();
    
// Update dashboard summary counts
document.getElementById("totalCount").textContent = leaves.length;

document.getElementById("pendingCount").textContent =
    leaves.filter(leave =>
        (leave.status || "Pending").toLowerCase() === "pending"
    ).length;

document.getElementById("approvedCount").textContent =
    leaves.filter(leave =>
        (leave.status || "").toLowerCase() === "approved"
    ).length;

document.getElementById("rejectedCount").textContent =
    leaves.filter(leave =>
        (leave.status || "").toLowerCase() === "rejected"
    ).length;


    const table = document.getElementById("leaveTable");

    table.innerHTML = "";

    leaves.forEach(leave => {
    const row = table.insertRow();

    row.insertCell(0).textContent = leave.employeeName || "";
    row.insertCell(1).textContent = leave.leaveType || "";
    row.insertCell(2).textContent = leave.fromDate || "";
    row.insertCell(3).textContent = leave.toDate || "";
   const statusCell = row.insertCell(4);
   const status = leave.status || "Pending";
   const badge = document.createElement("span");
   badge.textContent = status;
   badge.classList.add(status.toLowerCase());

statusCell.appendChild(badge);

    const actionCell = row.insertCell(5);

    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.onclick = () => updateLeaveStatus(leave.id, "Approved");
    actionCell.appendChild(approveBtn);

    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "Reject";
    rejectBtn.style.marginLeft = "8px";
    rejectBtn.onclick = () => updateLeaveStatus(leave.id, "Rejected");
    actionCell.appendChild(rejectBtn);
});

} catch (error) {
    console.error("Leave history error:", error);
}

}

document.addEventListener("DOMContentLoaded", loadLeaves);

async function updateLeaveStatus(id, status) {
    try {
        const response = await fetch(
            `${API_URL}/${id}/status?status=${status}`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            throw new Error("Status update failed");
        }

        alert(`Leave ${status} successfully!`);

        await loadLeaves();

    } catch (error) {
        console.error("Status update error:", error);
        alert("Unable to update leave status. Check the Console and Spring Boot terminal.");
    }
}


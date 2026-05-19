import React from 'react';

// Receiving downstream parameters through Props
function AttendanceList({ activeStudents }) {
  return (
    <div className="table-wrapper">
      <h3>Live Verified Attendance Logs</h3>
      {activeStudents.length === 0 ? (
        <p className="empty-state">No student check-ins recorded for this session yet.</p>
      ) : (
        <table className="roster-table">
          <thead>
            <tr>
              <th>ID Roll Number</th>
              <th>Full Name</th>
              <th>Timestamp</th>
              <th>Geofence Status</th>
            </tr>
          </thead>
          <tbody>
            {/* List Rendering using .map() */}
            {activeStudents.map((student) => (
              <tr key={student.id}>
                <td><strong>{student.id}</strong></td>
                <td>{student.name}</td>
                <td>{student.time}</td>
                <td><span className="geo-badge-success">{student.tracking}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AttendanceList;
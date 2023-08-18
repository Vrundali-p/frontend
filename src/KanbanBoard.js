import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortOption, setSortOption] = useState([]);

  useEffect(() => {
    fetchDataFromAPI();
  }, [groupingOption]);

  
  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get(`https://api.quicksell.co/v1/internal/frontend-assignment`);
      const groupedData = groupDataByOption(response.data.tickets, groupingOption);
      setSortOption(groupedData);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }

  };

const groupTickets = () => {
    let groupedData = {};
  
    if (groupingOption === 'status') {
      tickets.forEach(ticket => {
        const status = ticket.status;
        if (!groupedData[status]) {
          groupedData[status] = [];
        }
        groupedData[status].push(ticket);
      });
    } else if (groupingOption === 'user') {
      tickets.forEach(ticket => {
        const user = ticket.user;
        if (!groupedData[user]) {
          groupedData[user] = [];
        }
        groupedData[user].push(ticket);
      });
    } else if (groupingOption === 'priority') {
      tickets.forEach(ticket => {
        const priority = ticket.priority;
        if (!groupedData[priority]) {
          groupedData[priority] = [];
        }
        groupedData[priority].push(ticket);
      });
    }
  
    return groupedData;
  };
  
  const sortTickets = (groupedData) => {
    const sortedData = {};
  
    Object.keys(groupedData).forEach(groupKey => {
      const group = groupedData[groupKey];
  
      if (sortOption === 'priority') {
        sortedData[groupKey] = group.slice().sort((a, b) => b.priority - a.priority);
      } else if (sortOption === 'title') {
        sortedData[groupKey] = group.slice().sort((a, b) => a.title.localeCompare(b.title));
      }
    });
  
    return sortedData;
  };
  

  const groupedTickets = groupTickets();
  const sortedTickets = sortTickets(groupedTickets);

  return (
    <div className="kanban-board">
      <div className="grouping-options">
        <button onClick={() => sortTickets('status')}>By Status</button>
        <button onClick={() => sortTickets('user')}>By User</button>
        <button onClick={() => sortTickets('priority')}>By Priority</button>
      </div>
      {Object.keys(sortOption).map((groupValue) => (
        <div key={groupValue} className="group">
          <h3>{groupValue}</h3>
          <div className="tickets">
            {sortOption[groupValue].map((ticket) => (
              <div key={ticket.id} className="ticket">
                <h4>{ticket.title}</h4>
                <p>Tag: {ticket.tag.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      
    </div>
  );
};

export default KanbanBoard;
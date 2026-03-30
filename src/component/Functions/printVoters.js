/**
 * Print Utility for Registered Voters
 */

import dayjs from "dayjs";

/// Generates HTML content for printing registered voters
export const generateVotersPrintHTML = (voters) => {
  if (!Array.isArray(voters) || voters.length === 0) {
    return `
      <div style="text-align: center; padding: 2rem;">
        <p>No registered voters to print</p>
      </div>
    `;
  }

  // Generate HTML table for voters
  const votersHTML = `
    <table style="width: 100%; border:1px solid #141414; border-collapse: collapse; margin-bottom: 1rem;">
      <thead>
        <tr style="background-color: #f5f5f5; border-bottom: 1px solid #141414;">
          <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">S/N</th>
          <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">ID</th>
          <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">Photo</th>
          <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">Full Name</th>
          <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">Date of Birth</th>
           <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">Registration Date</th>
        </tr>
      </thead>
      
      <tbody>
        ${voters
          .map(
            (voter, index) => `
          <tr style="border-bottom: 1px solid #141414;">
            <td style="border: 1px solid #141414; padding: 0.75rem;">${index + 1}</td>
            <td style="border: 1px solid #141414; padding: 0.75rem;">${voter.id || ""}</td>
            <td style="border: 1px solid #141414; padding: 0.75rem;"> <img style="border-radius:0.2rem;" width="50" "height=58" src=${voter.image} alt="Photo" /> </td>
            <td style="border: 1px solid #141414; padding: 0.75rem;">${voter.name || ""}</td>
            <td style="border: 1px solid #141414; padding: 0.75rem;">${voter.dob || "N/A"}</td>
             <td style="border: 1px solid #141414; padding: 0.75rem;">${voter.dateCreated || "N/A"}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  return votersHTML;
};

/// Main function to print voters
export const printVoters = (voters, title = "Registered Voters Report") => {
  // Open a new window for printing
  const printWindow = window.open("", "_blank");

  // Handle case where popup is blocked or unavailable (e.g., on mobile)
  if (!printWindow) {
    console.error("Print window could not be opened. Popups may be blocked.");
    // Fallback: Use the browser's native print for the current page
    window.print();
    return;
  }

  const currentDate = dayjs().format("ddd, DD MMM, YYYY @ hh:mm a");

  // Generate the HTML content for the print window
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #141414;
          padding: 2rem;
          background: white;
        }
        
        .print-header {
          text-align: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #141414;
          padding-bottom: 1.5rem;
        }
        
        .print-header h1 {
          font-size: 2.2rem;
          color: #141414;
          margin-bottom: 0.5rem;
        }
        
        .print-header p {
          color: #666;
          font-size: 0.95rem;
        }
        
        .print-footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 1rem;
          border-top: 2px solid #666;
          color: #666;
          font-size: 1rem;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>

    <body>
      <div class="print-header">
        <h2>${title.toUpperCase()}</h2>
        <p>Generated on: ${currentDate}</p>
        <p>Total Registered Voters: ${voters.length}</p>
      </div>
      
      <div class="print-content">
        ${generateVotersPrintHTML(voters)}
      </div>
      
      <div class="print-footer">
        <p>This is an automated report from the E-Voting System powered by Kobby-Menz Tech Solutions. Call: 0546163240</p>
      </div>
    </body>

    </html>
  `;

  // Write the HTML content to the new window and trigger print
  try {
    printWindow.document.writeln(htmlContent);
    printWindow.document.close();

    // Trigger print dialog after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
    }, 950);
  } catch (error) {
    console.error("Error writing to print window:", error);
    printWindow.close();
  }
};

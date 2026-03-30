/**
 * Print Utility for Election Results
 */

import dayjs from "dayjs";

/// Generates HTML content for printing election results
export const generateElectionPrintHTML = (elections) => {
  if (!Array.isArray(elections) || elections.length === 0) {
    return `
      <div style="text-align: center; padding: 2rem;">
        <p>No elections to print</p>
      </div>
    `;
  }

  // Generate HTML for each election
  const electionHTML = elections
    .map(
      (election) => `
    <div style="page-break-inside: avoid; margin-bottom: 3rem; border-bottom: 2px solid #757575; padding-bottom: 2rem;">

      <h2 style="color: #141414; margin-bottom: 0.5rem; font-size: 1.8rem;">${election.title || "Untitled Election"}</h2>

      <p style="color: #666; margin: 0.5rem 0; font-size: 0.95rem;"><strong>Description:</strong> ${election.description || "N/A"}</p>

      <p style="color: #666; margin: 0.5rem 0; font-size: 0.95rem;"><strong>Status:</strong> ${election.status || "N/A"}</p>

      <p style="color: #666; margin: 0.5rem 0; font-size: 0.95rem;"><strong>Date Created:</strong> ${dayjs(election.dateCreated).format("ddd, DD MMM, YYYY @ hh:mm a").toLocaleString() || "N/A"}</p>
      <p style="color: #666; margin: 0.5rem 0; font-size: 0.95rem;"><strong>Start Date:</strong> ${dayjs(election.startDate).format("ddd, DD MMM, YYYY @ hh:mm a").toLocaleString() || "N/A"}</p>
      <p style="color: #666; margin: 0.5rem 0; font-size: 0.95rem;"><strong>End Date:</strong> ${dayjs(election.endDate).format("ddd, DD MMM, YYYY @ hh:mm a").toLocaleString() || "N/A"}</p>
      
      <h3 style="margin-top: 1.5rem; margin-bottom: 1rem; color: #333; font-size: 1.3rem;">Candidates</h3>
      ${
        Array.isArray(election.candidates) && election.candidates.length > 0
          ? `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
          <thead>
            <tr style="background-color: #f5f5f5; border-bottom: 1px solid #333;">
              <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">S/N</th>
              <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">ID</th>
              <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">Photo</th>
              <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">Candidate Name</th>
              <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">Position</th>
              <th style="border: 1px solid #141414; padding: 0.75rem; text-align: left; font-weight: 600;">No. of Votes</th>
            </tr>
          </thead>
          
          <tbody>
            ${election.candidates
              .map(
                (candidate) => `
              <tr style="border-bottom: 1px solid #141414;">
                <td style="border: 1px solid #141414; padding: 0.75rem;">${candidate.sn || ""}</td>
                <td style="border: 1px solid #141414; padding: 0.75rem;">${candidate.id || ""}</td>
                <td style="border: 1px solid #141414; padding: 0.75rem;"> <img style="border-radius:0.2rem;" width="50" "height=58" src=${candidate.image} alt="Photo" /> </td>
                <td style="border: 1px solid #141414; padding: 0.75rem;">${candidate.name || ""}</td>
                <td style="border: 1px solid #141414; padding: 0.75rem;">${candidate.position || "N/A"}</td>
                <td style="border: 1px solid #141414; padding: 0.75rem; text-align: center; font-weight: 600;">${candidate.votes || 0}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
          : `<p style="color: #999; font-style: italic;">No candidates added yet</p>`
      }
    </div>
  `,
    )
    .join("");

  return electionHTML;
};

export const printElectionResults = (
  elections,
  title = "Election Results Report",
) => {
  // Open a new window for printing
  const printWindow = window.open("", "_blank");

  // Handle case where popup is blocked or unavailable (e.g., on mobile)
  if (!printWindow) {
    console.error("Print window could not be opened. Popups may be blocked.");
    // Fallback: Use the browser's native print for the current page
    // In a real app, you might want to show a Toast notification here
    // For now, we'll use window.print() directly
    window.print();
    return;
  }

  const currentDate = dayjs()
    .format("ddd, DD MMM, YYYY @ hh:mm a")
    .toLocaleString();

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
          color: #333;
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
          border-top: 2px solid #ddd;
          color: #999;
          font-size: 0.85rem;
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
        <h2>${title.toLocaleUpperCase()}</h2>
        <p>Generated on: ${currentDate}</p>
        <p>Total Elections: ${elections.length}</p>
      </div>
      
      <div class="print-content">
        ${generateElectionPrintHTML(elections)}
      </div>
      
      <div class="print-footer">
        <p>This is an automated report from the E-Voting System powered by Kobby-Menz Tech Solutions. Call: 0546163240</p>
      </div>
    </body>
    </html>
  `;

  // Write the HTML content to the new window and trigger print
  try {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Trigger print dialog after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } catch (error) {
    console.error("Error writing to print window:", error);
    printWindow.close();
  }
};

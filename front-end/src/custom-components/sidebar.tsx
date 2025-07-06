// // import React, { useState } from "react";




// // function Sidebar() {
// // const toggleSidebar = () => {
// //     setIsSidebarOpen(!isSidebarOpen);
// // }

// //   const sidebarSections = [
// //     { id: 1, title: "Feymann Technique", icon: "🧠" },
// //     { id: 2, title: "Active Recall", icon: "🔄" },
// //   ];
// //   const sectionClasses =
// //     "my-3 hover:cursor-pointer hover:bg-[#F0EAD6] p-2 rounded-lg transition-colors duration-200";

// //     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
// //   return (
// //     <div className={`bg-[#FFFBF7] text-[#000000] h-screen p-4 flex flex-col justify-between ${isSidebarOpen ? "w-64" : "w-16"} transition-width duration-300`}>
// //       <div>
// //         {sidebarSections.map((section) => (
// //           <div className={`${sectionClasses} flex gap-1 ${isSidebarOpen ? "opacity-0 transition-opacity duration-600" : ""}`} key={section.id}>
// //             <div>{section.icon}</div>
// //             <div>{isSidebarOpen && section.title}</div>
// //           </div>
// //         ))}
// //       </div>

// //       <div className={`${sectionClasses}`} onClick={toggleSidebar}>x</div>
// //     </div>
// //   );
// // }

// // export default Sidebar;




// import React, { useState } from "react";




// function Sidebar() {
// const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
// }

//   const sidebarSections = [
//     { id: 1, title: "Feymann Technique", icon: "🧠" },
//     { id: 2, title: "Active Recall", icon: "🔄" },
//   ];
//   const sectionClasses =
//     "my-3 hover:cursor-pointer hover:bg-[#F0EAD6] p-2 rounded-lg transition-colors duration-200";

//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   return (
//     <div className={`bg-[#FFFBF7] text-[#000000] h-screen p-4 flex flex-col justify-between ${isSidebarOpen ? "w-64" : "w-16"} transition-width duration-300`}>
//       <div>
//         {sidebarSections.map((section) => (
//           <div className={`${sectionClasses} flex gap-1`} key={section.id}>
//             <div>{section.icon}</div>
//             <div className={`absolute left-14 ${isSidebarOpen ? "opacity-0 transition-opacity duration-500 ease-in-out active" : ""}`}>{isSidebarOpen && section.title}</div>
//           </div>
//         ))}
//       </div>

//       <div className={`${sectionClasses}`} onClick={toggleSidebar}>x</div>
//     </div>
//   );
// }

// export default Sidebar;


// import React, { useState } from "react";




// function Sidebar() {
// const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
// }

//   const sidebarSections = [
//     { id: 1, title: "Feymann Technique", icon: "🧠" },
//     { id: 2, title: "Active Recall", icon: "🔄" },
//   ];
//   const sectionClasses =
//     "my-3 hover:cursor-pointer hover:bg-[#F0EAD6] p-2 rounded-lg transition-colors duration-200";

//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   return (
//     <div className={`bg-[#FFFBF7] text-[#000000] h-screen p-4 flex flex-col justify-between ${isSidebarOpen ? "w-64" : "w-16"} transition-width duration-300`}>
//       <div>
//         {sidebarSections.map((section) => (
//           <div className={`${sectionClasses} flex gap-1 ${isSidebarOpen ? "opacity-0 transition-opacity duration-600" : ""}`} key={section.id}>
//             <div>{section.icon}</div>
//             <div>{isSidebarOpen && section.title}</div>
//           </div>
//         ))}
//       </div>

//       <div className={`${sectionClasses}`} onClick={toggleSidebar}>x</div>
//     </div>
//   );
// }

// export default Sidebar;




import React, { useState } from "react";
import { Link } from '@tanstack/react-router';



function Sidebar() {
const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
}
const openSidebar = () => {
    setIsSidebarOpen(true);
}

  const sidebarSections = [
    { id: 1, title: "Home", icon: "🏠", to: "/"},
    { id: 2, title: "Feynman Technique", icon: "🧠", to: "/study-techniques/feynmann" },
    { id: 3, title: "Active Recall", icon: "🔄", to: "/study-techniques/active-recall"},
  ];
  const sectionClasses =
    "my-3 hover:cursor-pointer hover:bg-[#F0EAD6] p-2 rounded-lg transition-colors duration-200";

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className={`bg-[#FFFBF7] text-[#000000] h-screen p-4 flex flex-col justify-between ${isSidebarOpen ? "w-64" : "w-16"} `}>
      <div>
        {sidebarSections.map((section) => (
          <Link to={section.to} onClick={openSidebar}><div className={`${sectionClasses} flex gap-1`} key={section.id}>
            <div>{section.icon}</div>
            <div>{isSidebarOpen && section.title}</div>
          </div>
            </Link>

          // <Link />
        ))}
      </div>

      <div className={`${sectionClasses}`} onClick={toggleSidebar}>x</div>
    </div>
  );
}

export default Sidebar;

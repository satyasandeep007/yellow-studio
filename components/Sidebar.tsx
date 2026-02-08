type SidebarProps = {
   projects: Array<{
      id: string;
      name: string;
      updatedAt: string;
   }>;
   currentProjectId?: string;
   onSelectProject: (id: string) => void;
   onNewProject: () => void;
   showSessionsLink?: boolean;
};

export function Sidebar({
   projects,
   currentProjectId,
   onSelectProject,
   onNewProject,
   showSessionsLink = true,
}: SidebarProps) {
   return (
      <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50">
         {/* Sidebar Header */}
         <div className="border-b border-gray-200 p-4">
            <button
               onClick={onNewProject}
               className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
               New Project
            </button>
         </div>

         {/* Projects List */}
         <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
               Recent Projects
            </div>
            <div className="space-y-1">
               {projects.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-gray-500">
                     No projects yet
                  </div>
               ) : (
                  projects.map((project) => (
                     <button
                        key={project.id}
                        onClick={() => onSelectProject(project.id)}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${currentProjectId === project.id
                           ? 'bg-gray-200 text-gray-900'
                           : 'text-gray-700 hover:bg-gray-100'
                           }`}
                     >
                        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="flex-1 overflow-hidden">
                           <div className="truncate font-medium">{project.name}</div>
                           <div className="text-xs text-gray-500">{project.updatedAt}</div>
                        </div>
                     </button>
                  ))
               )}
            </div>

            {showSessionsLink && (
               <div className="mt-6 px-3">
                  <a
                     href="/user/sessions"
                     className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 hover:border-gray-400 hover:text-gray-800"
                  >
                     <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     Sessions
                  </a>
               </div>
            )}
         </div>

         {/* Sidebar Footer */}
         <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               </div>
               <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">Yellow Studio</div>
                  <div className="text-xs text-gray-600">Website Builder</div>
               </div>
            </div>
         </div>
      </div>
   );
}

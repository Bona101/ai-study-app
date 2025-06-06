import "./App.css";

function App() {
  const appName = "My App";
  const sidebarItems = [
    { id: 1, content: "Feynmann Technique" },
    { id: 2, content: "Active recall" },
  ];

  return (
    <div>
      {/* */}
      <div>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      Select Workspace
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                    <DropdownMenuItem>
                      <span>Acme Inc</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Acme Corp.</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
        </Sidebar>
      </div>
      {/*  */}
      <div>
        {sidebarItems.map((item) => (
          <div key={item.id} className="sidebar-item">
            {item.content}
          </div>
        ))}
      </div>
      <div>
        <h1>{appName}</h1>
      </div>
      <div className="flex justify-between">
        <p>hi</p>
        <p>lo</p>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import ParticipantsAndCoStewardNew from "../../Views/ParticipantCoSteward/ParticipantAndCoStewardNew";
import CoStewardAndParticipantsCard from "../../Components/CoStewardAndParticipants/CostewardAndParticipants";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";

describe("render the labels and buttons", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  //check for Costeward label
  test("render tab labels", () => {
    render(<ParticipantsAndCoStewardNew />, { wrapper: FarmStackProvider });
    const spanElement = screen.queryAllByTestId(/Participant/i);
    expect(spanElement).not.toBeNull();
  });

  //check add part button
  test("render add part btn exists", () => {
    render(<CoStewardAndParticipantsCard />, { wrapper: FarmStackProvider });
    const addParticipantBtn = screen.queryAllByTestId("add-new-participants");
    expect(addParticipantBtn).not.toBeNull();
  });
  //check loadmore button
  test("render loadmore button ", () => {
    render(
      <Router>
        <CoStewardAndParticipantsCard />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const loadmoreButton = screen.queryAllByTestId("load-more-btn");
    expect(loadmoreButton).not.toBeNull();
  });
  test("handleViewDataset is called with the correct argument on click", () => {
    const data = [
      { id: 1, name: "Item 1", user_id: 101 },
      { id: 2, name: "Item 2", user_id: 102 },
      // Add more items as needed
    ];
    render(
      <Router>
        <CoStewardAndParticipantsCard
          coStewardOrParticipantsList={data}
          viewType="list"
        />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const viewDatasetButtons = screen.getAllByTestId("list-item");
    fireEvent.click(viewDatasetButtons[0]);
  });
  test("handleViewDataset is called with the correct argument on click of cards", () => {
    const data = [
      { id: 1, name: "Item 1", user_id: 103 },
      { id: 2, name: "Item 2", user_id: 104 },
      // Add more items as needed
    ];
    render(
      <Router>
        <CoStewardAndParticipantsCard coStewardOrParticipantsList={data} />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const viewDatasetGridButtons = screen.getAllByTestId("grid-item");
    fireEvent.click(viewDatasetGridButtons[0]);
    screen.debug();
  });
  test("click invite button", () => {
    render(
      <Router>
        <CoStewardAndParticipantsCard
          guestUser={false}
          title="Participants" // Set the title to "Participants" for the button to be rendered
          viewType="grid"
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const inviteButton = screen.getByTestId("invite-btn-test");
    fireEvent.click(inviteButton);
    expect(window.location.pathname).toBe("/datahub/participants/invite");
  });
  test("click invite button for list", () => {
    render(
      <Router>
        <CoStewardAndParticipantsCard
          guestUser={false}
          title="Participants" // Set the title to "Participants" for the button to be rendered
          viewType="list"
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const inviteButton = screen.getByTestId("invite-btn-test-list");
    fireEvent.click(inviteButton);
    expect(window.location.pathname).toBe("/datahub/participants/invite");
  });
  test("click add button", () => {
    render(
      <Router>
        <CoStewardAndParticipantsCard
          guestUser={false}
          title="Participants" // Set the title to "Participants" for the button to be rendered
          viewType="list"
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const addButton = screen.getByTestId("add-new-participants");
    fireEvent.click(addButton);
    expect(window.location.pathname).toBe("/datahub/participants/add");
  });
 
  test("check grid view", () => {
    const setViewTypeMock = jest.fn(); // Create a mock function for setViewType

    render(
      <Router>
        <CoStewardAndParticipantsCard
          guestUser={false}
          title="Participants"
          viewType="list"
          setViewType={setViewTypeMock}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const gridView = screen.getByTestId("grid-view");
    fireEvent.click(gridView);
  });
  test("check list view", () => {
    const setViewTypeMock = jest.fn();

    render(
      <Router>
        <CoStewardAndParticipantsCard
          guestUser={false}
          title="Participants"
          viewType="list"
          setViewType={setViewTypeMock}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const listView = screen.getByTestId("list-view");
    fireEvent.click(listView);
  });
  test("click grid button in grid", () => {
    const setViewTypeMock = jest.fn();
    render(
      <Router>
        <CoStewardAndParticipantsCard
          guestUser={false}
          title="Participants"
          viewType="grid"
          setViewType={setViewTypeMock}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const gridButton = screen.getByTestId("grid-view-test");
    fireEvent.click(gridButton);
  });
  test("click list button in grid", () => {
    const setViewTypeMock = jest.fn();
    render(
      <Router>
        <CoStewardAndParticipantsCard
          guestUser={false}
          title="Participants"
          viewType="grid"
          setViewType={setViewTypeMock}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const listButton = screen.getByTestId("list-view-test");
    fireEvent.click(listButton);
  });
  test("click load more button", () => {
    const loadmore = jest.fn();
    render(
      <Router>
        <CoStewardAndParticipantsCard loadMoreButton={loadmore} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const loadmoreButton = screen.getByTestId("load-more-button-test-button");
    fireEvent.click(loadmoreButton);
  });

  test("handledataset function view", () => {
    const data = [
      {
        id: 1,
        name: "dummy org",
        dataset_count: 3,
        number_of_participants: 20,
      },
      {
        id: 2,
        name: "sample org",
        dataset_count: 4,
        number_of_participants: 20,
      },
    ];
    render(
      <Router>
        <CoStewardAndParticipantsCard
          coStewardOrParticipantsList={data}
          isCosteward={true}
          viewType="list"
          title="Co-steward"
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const viewDatasetGridButtons = screen.getAllByTestId("list-item");
    fireEvent.click(viewDatasetGridButtons[0]);
  });
  test("handledataset function view for home", () => {
    const data = [
      { id: 1, name: "dummy org", dataset_count: 3, first_name: "test 1" },
      { id: 2, name: "sample org", dataset_count: 4, first_name: "john" },
    ];
    render(
      <Router>
        <CoStewardAndParticipantsCard
          coStewardOrParticipantsList={data}
          title="Participants"
          guestUser={true}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const viewDatasetGridButtons = screen.getAllByTestId("grid-item");
    fireEvent.click(viewDatasetGridButtons[0]);
  });
  test("handledataset function view for New participant requests", () => {
    const data = [
      {
        id: 1,
        name: "dummy org",
        first_name: "henry",
        last_name: "Antony",
        email: "antony@gmail.com",
      },
      {
        id: 2,
        name: "sample org",
        first_name: "william",
        last_name: "george",
        email: "william@gmail.com",
      },
    ];
    render(
      <Router>
        <CoStewardAndParticipantsCard
          coStewardOrParticipantsList={data}
          title="New participant requests"
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const viewDatasetGridButtons = screen.getAllByTestId("grid-item");
    fireEvent.click(viewDatasetGridButtons[0]);
  });
  test("handledataset function view for Costeward participant", () => {
    const data = [
      { id: 1, name: "dummy org", first_name: "henry", last_name: "Antony" },
      { id: 2, name: "sample org", first_name: "william", last_name: "george" },
    ];
    render(
      <Router>
        <CoStewardAndParticipantsCard
          coStewardOrParticipantsList={data}
          title="Co-steward participants"
          guestUser={true}
          isCosteward={false}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const viewDatasetGridButtons = screen.getAllByTestId("grid-item");
    fireEvent.click(viewDatasetGridButtons[0]);
  });

  describe("rendering costeward list", () => {
    test("renders the list items correctly", () => {
      const mockData = [
        {
          user_id: 1,
          organization: { name: "Organization 1" },
          dataset_count: 10,
          number_of_participants: 5,
        },
      ];

      const component = render(
        <Router>
          <CoStewardAndParticipantsCard
            coStewardOrParticipantsList={mockData}
          />
        </Router>
      );
      const listItems = component.queryAllByTestId("list-item");
      listItems.forEach((item, index) => {
        const organizationName = item.queryByTestId(
          `organization-name-${index}`
        );
        const datasetCount = item.queryByTestId(`dataset-count-${index}`);
        const numberOfParticipants = item.queryByTestId(
          `number-of-participants-${index}`
        );

        expect(organizationName.textContent).toBe(
          mockData[index].organization.name
        );
        expect(datasetCount.textContent).toBe(
          mockData[index].dataset_count.toString()
        );
        expect(numberOfParticipants.textContent).toBe(
          mockData[index].number_of_participants.toString()
        );
      });
    });
  });

  describe("rendering participant list", () => {
    test("renders the list items correctly", () => {
      const mockData = [
        {
          user_id: 7,
          organization: { name: "demo org of participant 5" },
          dataset_count: 3,
          root_user: { first_name: "Kumar" },
        },
      ];

      const component = render(
        <Router>
          <CoStewardAndParticipantsCard
            coStewardOrParticipantsList={mockData}
          />
        </Router>
      );
      const listItems = component.queryAllByTestId("list-item");
      listItems.forEach((item, index) => {
        const partOrganizationName = item.queryByTestId(
          `part-organization-name-${index}`
        );
        const datasetCount = item.queryByTestId(`part-dataset-count-${index}`);
        const rootUser = item.queryByTestId(`root-user-${index}`);

        expect(partOrganizationName.textContent).toBe(
          mockData[index].organization.name
        );
        expect(datasetCount.textContent).toBe(
          mockData[index].dataset_count.toString()
        );
        expect(rootUser.textContent).toBe(mockData[index].user_id.first_name);
      });
    });
  });

  describe("rendering new participant request list", () => {
    test("renders the list items correctly", () => {
      const mockData = [
        {
          user_id: 10,
          organization: { name: "DG ORG" },
          user: { first_name: "Kumar" },
          user: { email: "kumar@dg.org" },
        },
      ];

      const component = render(
        <Router>
          <CoStewardAndParticipantsCard
            coStewardOrParticipantsList={mockData}
          />
        </Router>
      );
      const listItems = component.queryAllByTestId("list-item");
      listItems.forEach((item, index) => {
        const requestUserOrganizationName = item.queryByTestId(
          `part-organization-name-${index}`
        );
        const requestUserName = item.queryByTestId(
          `part-dataset-count-${index}`
        );
        const requestUserEmail = item.queryByTestId(`root-user-${index}`);

        expect(requestUserOrganizationName.textContent).toBe(
          mockData[index].organization.name
        );
        expect(requestUserName.textContent).toBe(
          mockData[index].user.first_name
        );
        expect(requestUserEmail.textContent).toBe(
          mockData[index].user_id.email
        );
      });
    });
  });
});

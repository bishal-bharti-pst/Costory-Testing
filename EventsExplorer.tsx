import {
  ActionIcon,
  Drawer,
  Indicator,
  Tooltip,
  Tabs,
  Text,
  Stack,
  Switch,
  Card,
  Chip,
  Button,
  Group,
  DrawerTitle,
  Checkbox,
} from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import {
  IconBrandGithub,
  IconCalendar,
  IconPlus,
  IconBrandAws,
} from "@tabler/icons-react"
import { UseQueryResult } from "@tanstack/react-query"

import {
  emptyEvents,
  EventsResponses,
  getEventsFromCategory,
  SearchEvents,
} from "@costory/types/endpoints/events"
import { AggBy, EventCategory } from "@costory/types/prisma-client"

import { QueryWrapper } from "@costory/front/components/layout/QueryWrapper"
import { useGithubReposQuery } from "@costory/front/queries/events"
import { useEventsQuery } from "@costory/front/queries/explore"
import { IconsEventsCategory } from "@costory/front/utils/events"

export const EventsExplorer = ({
  form,
  filters,
  openNewEventModal,
  setNewEventCategory,
}: {
  form: UseFormReturnType<SearchEvents>
  filters: {
    from: Date
    to: Date
    aggBy: AggBy
  }
  openNewEventModal: () => void
  setNewEventCategory: (category: EventCategory) => void
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const eventsQuery = useEventsQuery({
    searchForm: {
      filters,
      searchEvents: form.getValues(),
    },
  })
  return (
    <>
      <Tooltip label="Display Events">
        <Indicator
          inline
          size={25}
          offset={5}
          label={<EventsCount eventsQuery={eventsQuery} />}
        >
          <ActionIcon onClick={open} size="xl">
            <IconCalendar
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Indicator>
      </Tooltip>
      <Drawer.Root
        opened={opened}
        onClose={close}
        position="right"
        size="380px"
      >
        <Drawer.Overlay />
        <Drawer.Content bg="drawerBg.0">
          <Drawer.Header bg="drawerBg.0">
            <DrawerTitle>
              <Text fw={600}>Filter Events</Text>
            </DrawerTitle>
          </Drawer.Header>
          <Drawer.Body>
            <Tabs defaultValue={EventCategory.BUSINESS} keepMounted={false}>
              <Stack gap={10} mt={30}>
                <CustomEventsSelector
                  eventsQuery={eventsQuery}
                  setNewEventCategory={setNewEventCategory}
                  openNewEventModal={openNewEventModal}
                  enabled={
                    form.getInputProps("customBusinessEvents.enabled").value
                  }
                  setEnabled={
                    form.getInputProps("customBusinessEvents.enabled").onChange
                  }
                  mode={EventCategory.BUSINESS}
                />

                <CustomEventsSelector
                  eventsQuery={eventsQuery}
                  setNewEventCategory={setNewEventCategory}
                  openNewEventModal={openNewEventModal}
                  enabled={
                    form.getInputProps("customTechnicalEvents.enabled").value
                  }
                  setEnabled={
                    form.getInputProps("customTechnicalEvents.enabled").onChange
                  }
                  mode={EventCategory.TECHNICAL}
                />

                <ProviderEventsSelector
                  eventsQuery={eventsQuery}
                  enabled={form.getInputProps("providerEvents.enabled").value}
                  setEnabled={
                    form.getInputProps("providerEvents.enabled").onChange
                  }
                  commitments={
                    form.getInputProps("providerEvents.commitments").value
                  }
                  setCommitments={
                    form.getInputProps("providerEvents.commitments").onChange
                  }
                  marketplacePurchases={
                    form.getInputProps("providerEvents.marketplacePurchases")
                      .value
                  }
                  setMarketplacePurchases={
                    form.getInputProps("providerEvents.marketplacePurchases")
                      .onChange
                  }
                  reservations={
                    form.getInputProps("providerEvents.reservations").value
                  }
                  setReservations={
                    form.getInputProps("providerEvents.reservations").onChange
                  }
                />

                <GithubEventsSelector
                  eventsQuery={eventsQuery}
                  reposSelected={form.getInputProps("githubSource.repos").value}
                  setReposSelected={
                    form.getInputProps("githubSource.repos").onChange
                  }
                />
              </Stack>
            </Tabs>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}

const CustomEventsSelector = ({
  eventsQuery,
  enabled,
  setEnabled,
  mode,
  openNewEventModal,
  setNewEventCategory,
}: {
  eventsQuery: UseQueryResult<EventsResponses.Aggregated>
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  mode: EventCategory
  openNewEventModal: () => void
  setNewEventCategory: (category: EventCategory) => void
}) => {
  return (
    <Indicator
      inline
      size={25}
      offset={5}
      label={
        <EventsCount
          category="custom"
          eventsQuery={eventsQuery}
          mode={mode}
          fw={200}
        />
      }
    >
      <Card withBorder>
        <Group align="center" gap={8}>
          <Stack gap={10} style={{ flex: 1 }}>
            <IconsEventsCategory category={mode} />
            <Text fw={500} size="sm">
              Custom events {mode}
            </Text>
            <Group gap={8} align="center" justify="space-between">
              <Switch
                size="sm"
                mr={4}
                checked={enabled}
                onChange={(event) => setEnabled(event.currentTarget.checked)}
              />

              <Button
                variant="light"
                color="blue"
                size="xs"
                style={{ marginLeft: "auto" }}
                leftSection={<IconPlus size={14} />}
                onClick={() => {
                  setNewEventCategory(mode)
                  openNewEventModal()
                }}
              >
                New
              </Button>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Indicator>
  )
}

const ProviderEventsSelector = ({
  enabled,
  setEnabled,
  commitments,
  setCommitments,
  marketplacePurchases,
  setMarketplacePurchases,
  reservations,
  setReservations,
  eventsQuery,
}: {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  commitments: boolean
  setCommitments: (enabled: boolean) => void
  marketplacePurchases: boolean
  setMarketplacePurchases: (enabled: boolean) => void
  reservations: boolean
  setReservations: (enabled: boolean) => void
  eventsQuery: UseQueryResult<EventsResponses.Aggregated>
}) => {
  return (
    <Indicator
      inline
      size={25}
      offset={5}
      label={
        <EventsCount
          eventsQuery={eventsQuery}
          mode={EventCategory.PROVIDER}
          fw={200}
          category="provider"
        />
      }
    >
      <Card withBorder>
        <Stack gap={10} style={{ flex: 1 }}>
          <Group align="center" gap={8}>
            <IconBrandAws size={20} stroke={1.5} />
            <Text fw={500} size="sm">
              Provider Events
            </Text>
          </Group>
          <Group gap={8} align="center" justify="space-between">
            <Switch
              size="sm"
              mr={4}
              checked={enabled}
              onChange={(event) => setEnabled(event.currentTarget.checked)}
            />
          </Group>
          <Stack gap={8} opacity={enabled ? 1 : 0.5}>
            <Checkbox
              label="Commitments"
              checked={commitments}
              onChange={(event) => setCommitments(event.currentTarget.checked)}
              disabled={!enabled}
            />
            <Checkbox
              label="Marketplace Purchases"
              checked={marketplacePurchases}
              onChange={(event) =>
                setMarketplacePurchases(event.currentTarget.checked)
              }
              disabled={!enabled}
            />
            <Checkbox
              label="Reservations"
              checked={reservations}
              onChange={(event) => setReservations(event.currentTarget.checked)}
              disabled={!enabled}
            />
          </Stack>
        </Stack>
      </Card>
    </Indicator>
  )
}
const GithubEventsSelector = ({
  reposSelected,
  setReposSelected,
  eventsQuery,
}: {
  reposSelected: string[]
  setReposSelected: (repos: string[]) => void
  eventsQuery: UseQueryResult<EventsResponses.Aggregated>
}) => {
  const queryRepo = useGithubReposQuery()
  return (
    <Indicator
      inline
      size={25}
      offset={5}
      label={
        <EventsCount
          eventsQuery={eventsQuery}
          mode={EventCategory.TECHNICAL}
          fw={200}
          category="github"
        />
      }
    >
      <Card withBorder>
        <QueryWrapper query={queryRepo} allowEmptyArray>
          {({ data }) => {
            return (
              <Tooltip
                disabled={data.availableRepo.length > 0}
                label="Install Github App in Integrations to enable Github Events"
              >
                <Stack
                  gap={10}
                  style={{
                    opacity: data.availableRepo.length === 0 ? 0.5 : 1,
                  }}
                >
                  <IconBrandGithub size={20} stroke={1.5} />
                  <Text fw={500} size="sm">
                    Github Events
                  </Text>
                  <Text size="sm" color="dimmed">
                    Select a repository to enable Github Events
                  </Text>
                  <Group gap={5} opacity={reposSelected.length > 0 ? 1 : 0.5}>
                    {data.availableRepo.map((repo) => (
                      <Chip
                        key={repo.name}
                        checked={reposSelected.includes(repo.name)}
                        onChange={() => {
                          if (reposSelected.includes(repo.name)) {
                            setReposSelected(
                              reposSelected.filter((r) => r !== repo.name),
                            )
                          } else {
                            setReposSelected([...reposSelected, repo.name])
                          }
                        }}
                        variant="filled"
                      >
                        {repo.name}
                      </Chip>
                    ))}
                  </Group>
                </Stack>
              </Tooltip>
            )
          }}
        </QueryWrapper>
      </Card>
    </Indicator>
  )
}

const EventsCount = ({
  eventsQuery,
  mode,
  category,
  fw = 300,
}: {
  eventsQuery: UseQueryResult<EventsResponses.Aggregated>
  mode?: EventCategory
  fw?: number
  category?: "github" | "custom" | "provider"
}) => {
  return (
    <QueryWrapper defaultData={emptyEvents} query={eventsQuery} allowEmptyArray>
      {({ data }) => {
        const nbrEvents = getEventsFromCategory(data, mode)
          .map((el) => el.events)
          .flat()
          .filter((el) =>
            category
              ? category == "github"
                ? el.metadata?.source === "github"
                : category == "provider"
                  ? el.metadata?.source === "provider"
                  : category == "custom"
                    ? !el.metadata?.source
                    : false
              : true,
          ).length
        return <Text fw={fw}>{nbrEvents > 9 ? "9+" : nbrEvents}</Text>
      }}
    </QueryWrapper>
  )
}

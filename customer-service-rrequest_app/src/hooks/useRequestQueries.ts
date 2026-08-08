import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createServiceRequest, getServiceRequest, listServiceRequests, updateServiceRequestStatus } from "../api/apiRequest";
import type { CreateServiceRequest, ListServiceRequestsParams, UpdateRequestStatus } from "../types";

export const requestKeys = {
    all: ['requests'] as const,
    lists: () => [...requestKeys.all, 'list'] as const,
    list: (params: ListServiceRequestsParams) => [...requestKeys.lists(), { params }] as const,
    details: () => [...requestKeys.all, 'detail'] as const,
    detail: (id: string) => [...requestKeys.details(), id] as const,
    create: () => [...requestKeys.all, 'create'] as const,
    updateStatus: (id: string) => [...requestKeys.details(), id, 'update-status'] as const,
  };

export function useRequestQueryLists(params: ListServiceRequestsParams) {

    return useQuery({
        queryKey: requestKeys.list(params),
        queryFn: () => listServiceRequests(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useRequestQueryDetail(id: string | undefined) {
    return useQuery({
        queryKey: requestKeys.detail(id ?? ''),
        queryFn: ({ signal }) => getServiceRequest(id as string, signal),
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useCreateRequest(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateServiceRequest) => createServiceRequest(input),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: requestKeys.lists()})
        }
    })
}

export function useUpdateRequestStatus(id: string){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: UpdateRequestStatus) => updateServiceRequestStatus(id, input),
        onSuccess: (updated) => {
            queryClient.setQueryData(requestKeys.detail(id), updated);
            queryClient.invalidateQueries({queryKey: requestKeys.all, exact: false})
        }
    })
}
 
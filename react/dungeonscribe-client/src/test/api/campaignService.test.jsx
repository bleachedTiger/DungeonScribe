import api from '../../api/axios'
import { campaignService } from '../../api/campaignService'

// Mock the axios module
vi.mock('../../api/axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: {use: vi.fn()},
            response: {use: vi.fn()},
        },
    },
}));

describe('campaignService', () => {

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        vi.clearAllMocks();
    });

    it('getAll should call GET /campaigns', async () => {
        const mockCampaigns = [
            {id: 1, name: 'Lost Mines', setting: 'Forgotten Realms'},
            {id: 2, name: 'Curse of Strahd', setting: 'Ravenloft'},
        ];
        api.get.mockResolvedValue({data: mockCampaigns});

        const response = await campaignService.getAll();

        expect(api.get).toHaveBeenCalledWith('/campaigns');
        expect(response.data).toEqual(mockCampaigns);
    });

    it("getOne should call GET /campaigns/:id", async () => {
        const mockCampaign = {id: 1, name: 'Lost Mines'};
        api.get.mockResolvedValue({data: mockCampaign});

        const response = await campaignService.getOne(1);

        expect(api.get).toHaveBeenCalledWith('/campaigns/1');
        expect(response.data).toEqual(mockCampaign);
    });

    it("create should call POST /campaigns with data", async () => {
        const mockCampaign = {id: 1, name: 'LostMines', description: 'A classic D&D adventure', setting: 'Forgotten Realms'};
        const mockResponse = { id: 1, ...mockCampaign };
        api.post.mockResolvedValueOnce({data: mockResponse});

        const response = await campaignService.create(mockCampaign);
        
        expect(api.post).toHaveBeenCalledWith('/campaigns', mockCampaign);
        expect(response.data).toEqual(mockResponse);
    });

    it("update should call PUT /campaigns/:id with data", async () => {
        const mockCampaign = {id: 1, name: 'Lost Mines', description: 'Updated description', setting: 'Eberron'};
        const mockResponse = { id: 1, ...mockCampaign };
        api.put.mockResolvedValueOnce({data: mockResponse});

        const response = await campaignService.update(1, mockCampaign);

        expect(api.put).toHaveBeenCalledWith('/campaigns/1', mockCampaign);
        expect(response.data).toEqual(mockResponse);
    });

    it("delete should call DELETE /campaigns/:id", async () => {
        api.delete.mockResolvedValueOnce({data: null });

        await campaignService.delete(1);

        expect(api.delete).toHaveBeenCalledWith('/campaigns/1');
    });

    it("getAll should throw an error if API call fails", async () => {
        api.get.mockRejectedValueOnce(new Error('Network error'));

        await expect(campaignService.getAll()).rejects.toThrow('Network error');
    });
})

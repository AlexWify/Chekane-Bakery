using ChekaneCRM.Backend.Models.Dto;

namespace ChekaneCRM.Backend.Services
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllAsync();
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(ProductDto dto);
        Task<ProductDto?> UpdateAsync(int id, ProductDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ToggleAvailabilityAsync(int id);
    }
}
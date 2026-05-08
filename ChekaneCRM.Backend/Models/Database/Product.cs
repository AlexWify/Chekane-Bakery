namespace ChekaneCRM.Backend.Models.Database
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
        
       
        public double Proteins { get; set; } = 0;      // Белки
        public double Fats { get; set; } = 0;          // Жиры
        public double Carbohydrates { get; set; } = 0; // Углеводы
        public int Calories { get; set; } = 0;         // Ккал
        public string Ingredients { get; set; } = string.Empty; // Состав
    }
}

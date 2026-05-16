#  Этап 1: сборка проекта 
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore ChekaneCRM.Backend.csproj

COPY . ./
RUN dotnet publish ChekaneCRM.Backend.csproj -c Release -o /app/publish

#  Этап 2: финальный образ для запуска 
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=build /app/publish ./
RUN mkdir -p /app/data

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ChekaneCRM.Backend.dll"]